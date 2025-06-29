#!/bin/bash

# VPS Setup Script - Setup VPS từ đầu cho PHG Corporation
# Chạy script này trên VPS Ubuntu mới tinh

set -e

echo "🚀 VPS Setup Script - PHG Corporation"
echo "====================================="
echo "Setup VPS từ đầu với tất cả dependencies cần thiết"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Script này cần chạy với quyền root"
        echo "Chạy: sudo bash vps-setup.sh"
        exit 1
    fi
}

# Update system
update_system() {
    print_status "Updating system packages..."
    
    export DEBIAN_FRONTEND=noninteractive
    apt update -y
    apt upgrade -y
    apt autoremove -y
    
    print_status "System updated successfully"
}

# Install basic tools
install_basic_tools() {
    print_status "Installing basic tools..."
    
    export DEBIAN_FRONTEND=noninteractive
    apt install -y \
        curl \
        wget \
        vim \
        nano \
        htop \
        tree \
        unzip \
        zip \
        git \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        ufw \
        fail2ban \
        certbot \
        python3-certbot-nginx \
        build-essential \
        jq
        
    print_status "Basic tools installed"
}

# Install Node.js (LTS version)
install_nodejs() {
    print_status "Installing Node.js LTS..."
    
    # Install NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt install -y nodejs
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    
    print_status "Node.js $node_version and npm $npm_version installed"
}

# Install Docker - ALREADY INSTALLED, SKIP
install_docker() {
    print_status "Checking Docker installation..."
    
    if command -v docker >/dev/null 2>&1; then
        print_status "Docker already installed - skipping"
        
        # Show versions
    docker_version=$(docker --version)
        compose_version=$(docker compose version 2>/dev/null || echo "Docker Compose plugin installed")
    
        print_status "Docker: $docker_version"
        print_status "Docker Compose: $compose_version"
    else
        print_error "Docker not found - please install Docker first"
        exit 1
    fi
}

# Install Nginx
install_nginx() {
    print_status "Installing Nginx..."
    
    apt install -y nginx
    
    # Start and enable Nginx
    systemctl start nginx
    systemctl enable nginx
    
    # Stop nginx for now (will be managed by Docker)
    systemctl stop nginx
    
    nginx_version=$(nginx -v 2>&1)
    print_status "Nginx installed: $nginx_version"
}

# Create deployment user
create_deploy_user() {
    print_status "Creating deployment user..."
    
    # Create user if doesn't exist
    if ! id -u deploy >/dev/null 2>&1; then
        useradd -m -s /bin/bash deploy
        print_status "User deploy created"
    else
        print_warning "User deploy already exists"
    fi
    
    # Add to docker group
    usermod -aG docker deploy
    usermod -aG sudo deploy
    
    # Create .ssh directory
    mkdir -p /home/deploy/.ssh
    chown deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    
    # Create a simple .bashrc for deploy user
    cat > /home/deploy/.bashrc << 'EOFBASHRC'
# Basic bashrc for deploy user
export PATH=$PATH:/usr/local/bin
export EDITOR=nano
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'

# Docker aliases
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dc='docker compose'

# Show deployment info
echo "🚀 Deploy user ready! Available commands:"
echo "  - docker, docker compose"
echo "  - git, node, npm"
echo "  - nano, vim"
EOFBASHRC
    chown deploy:deploy /home/deploy/.bashrc
    
    print_status "User deploy configured with Docker and sudo access"
}

# Setup firewall
setup_firewall() {
    print_status "Configuring firewall..."
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (current session)
    ufw allow ssh
    ufw allow 22
    
    # Allow HTTP and HTTPS
    ufw allow 80
    ufw allow 443
    
    # Allow custom ports for development (optional)
    ufw allow 3000 comment 'Frontend Dev'
    ufw allow 3002 comment 'Backend API'
    
    # Enable firewall
    ufw --force enable
    
    print_status "Firewall configured (SSH, HTTP, HTTPS, Dev ports allowed)"
}

# Setup fail2ban
setup_fail2ban() {
    print_status "Configuring fail2ban..."
    
    # Create SSH jail configuration
    cat > /etc/fail2ban/jail.local << 'EOFJAIL'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOFJAIL
    
    # Start and enable fail2ban
    systemctl start fail2ban
    systemctl enable fail2ban
    
    print_status "Fail2ban configured for SSH protection"
}

# Create swap file (if needed)
create_swap() {
    print_status "Checking swap..."
    
    # Check if swap already exists
    if [ -f /swapfile ]; then
        print_warning "Swap file already exists"
        return
    fi
    
    # Check available disk space
    available_space=$(df / | awk 'NR==2{printf "%.0f", $4/1024/1024}')
    if [ "$available_space" -lt 3 ]; then
        print_warning "Not enough disk space for swap file (need 3GB, have ${available_space}GB)"
        return
    fi
    
        print_status "Creating 2GB swap file..."
        
    # Create swap file
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1024 count=2097152
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        
        # Make swap permanent
        echo "/swapfile none swap sw 0 0" >> /etc/fstab
        
    # Optimize swap settings
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
    
    print_status "Swap file created and optimized"
}

# Create application directories
create_app_directories() {
    print_status "Creating application directories..."
    
    # Create directories as deploy user
    sudo -u deploy mkdir -p /home/deploy/apps
    sudo -u deploy mkdir -p /home/deploy/backups
    sudo -u deploy mkdir -p /home/deploy/logs
    sudo -u deploy mkdir -p /home/deploy/ssl
    sudo -u deploy mkdir -p /home/deploy/scripts
    
    # Create a welcome script
    cat > /home/deploy/scripts/welcome.sh << 'EOFWELCOME'
#!/bin/bash
echo "🎉 Welcome to PHG Corporation VPS!"
echo "=================================="
echo "Available directories:"
echo "  ~/apps/     - Your applications"
echo "  ~/backups/  - Database & file backups"
echo "  ~/logs/     - Application logs"
echo "  ~/ssl/      - SSL certificates"
echo "  ~/scripts/  - Utility scripts"
echo ""
echo "Quick commands:"
echo "  docker ps              - Show running containers"
echo "  docker compose logs -f - Follow logs"
echo "  df -h                  - Check disk space"
echo "  free -h                - Check memory usage"
echo ""
EOFWELCOME
    chmod +x /home/deploy/scripts/welcome.sh
    chown -R deploy:deploy /home/deploy/scripts
    
    print_status "Application directories created"
}

# Final instructions
show_final_instructions() {
    echo ""
    echo "🎉 VPS Setup hoàn thành!"
    echo "======================"
    echo ""
    print_status "Các tools đã cài đặt:"
    echo "  - Git: $(git --version)"
    echo "  - Node.js: $(node --version)"
    echo "  - NPM: $(npm --version)"
    echo "  - Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
    echo "  - Docker Compose: $(docker compose version --short 2>/dev/null || echo 'plugin installed')"
    echo "  - Nginx: $(nginx -v 2>&1 | cut -d' ' -f3)"
    echo ""
    print_status "Security configured:"
    echo "  - UFW Firewall: Active (ports 22, 80, 443, 3000, 3002)"
    echo "  - Fail2ban: Active for SSH protection" 
    echo "  - Non-root deploy user: Created with Docker access"
    echo ""
    print_status "System optimized:"
    echo "  - 2GB Swap file created"
    echo "  - System packages updated"
    echo "  - Basic development tools installed"
    echo ""
    print_status "Next steps:"
    echo "  1. Switch to deploy user: su - deploy"
    echo "  2. Run welcome script: ~/scripts/welcome.sh"
    echo "  3. Upload your application code to ~/apps/"
    echo "  4. Run your deployment script"
    echo ""
    print_warning "IMPORTANT SECURITY:"
    echo "  - Set password for deploy user: passwd deploy"
    echo "  - Setup SSH keys for deploy user"
    echo "  - Consider changing SSH port from default 22"
    echo "  - Update UFW rules if needed: ufw status"
    echo ""
    print_info "Test Docker: su - deploy && docker run hello-world"
    echo ""
    echo "🎉 VPS sẵn sàng cho deployment! 🚀"
}

# Main execution
main() {
    print_info "Bắt đầu setup VPS cho PHG Corporation..."
    echo ""
    echo "Script này sẽ cài đặt:"
    echo "✅ System updates & essential tools"
    echo "✅ Git, Node.js LTS, Docker (already installed), Nginx"
    echo "✅ Security (UFW Firewall, Fail2ban)"
    echo "✅ Deploy user với Docker access"
    echo "✅ System optimizations (swap, performance)"
    echo "✅ Application directories structure"
    echo ""
    
    read -p "Tiếp tục setup? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
    
    echo ""
    print_info "Starting VPS setup process..."
    
    check_root
    update_system
    install_basic_tools
    install_nodejs
    install_docker
    install_nginx
    create_deploy_user
    setup_firewall
    setup_fail2ban
    create_swap
    create_app_directories
    show_final_instructions
}

# Run main function
main
