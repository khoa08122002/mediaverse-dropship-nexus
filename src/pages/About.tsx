import React from 'react';
import Header from '../components/Header';

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                🏢 Về PHG Corporation
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Dẫn dắt tương lai
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> truyền thông số</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                PHG Corporation được thành lập với sứ mệnh đưa công nghệ AI và giải pháp E-commerce 
                tiên tiến đến gần hơn với các doanh nghiệp Việt Nam, giúp họ phát triển bền vững 
                trong kỷ nguyên số hóa.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Câu chuyện thành lập
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Được thành lập vào năm 2022 bởi đội ngũ chuyên gia có nhiều năm kinh nghiệm 
                    trong lĩnh vực marketing số và thương mại điện tử, PHG Corporation ra đời với mong muốn 
                    thu hẹp khoảng cách công nghệ giữa Việt Nam và thế giới.
                  </p>
                  <p>
                    Chúng tôi nhận thấy rằng nhiều doanh nghiệp Việt Nam vẫn đang gặp khó khăn trong 
                    việc áp dụng các công nghệ mới như AI, Machine Learning vào hoạt động kinh doanh. 
                    Từ đó, PHG Corporation được sinh ra để trở thành cầu nối, mang đến những giải pháp 
                    công nghệ tiên tiến nhưng dễ tiếp cận và phù hợp với thị trường Việt Nam.
                  </p>
                  <p>
                    Sau 5 năm phát triển, chúng tôi đã xây dựng được hệ sinh thái dịch vụ hoàn chỉnh 
                    với 3 công ty con chuyên biệt, phục vụ hơn 100+ doanh nghiệp từ startup đến 
                    các tập đoàn lớn.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                      <div className="text-sm text-gray-600">Khách hàng</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                      <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                      <div className="text-sm text-gray-600">Chuyên gia</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                      <div className="text-sm text-gray-600">Hài lòng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sứ mệnh & Tầm nhìn
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Democratize công nghệ AI và E-commerce, giúp mọi doanh nghiệp Việt Nam, 
                    dù lớn hay nhỏ, đều có thể tiếp cận và tận dụng sức mạnh của công nghệ 
                    để phát triển bền vững và cạnh tranh trên thị trường toàn cầu.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Trở thành công ty công nghệ hàng đầu Đông Nam Á trong lĩnh vực AI Marketing 
                    và E-commerce Solutions, góp phần nâng cao vị thế của Việt Nam trên bản đồ 
                    công nghệ thế giới vào năm 2030.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Giá trị cốt lõi
                </h2>
                <p className="text-xl text-gray-600">
                  Những nguyên tắc định hướng mọi hoạt động của PHG Corporation
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl">🔬</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                  <p className="text-gray-600">
                    Không ngừng nghiên cứu và áp dụng những công nghệ mới nhất để mang lại 
                    giá trị vượt trội cho khách hàng.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Partnership</h3>
                  <p className="text-gray-600">
                    Xây dựng mối quan hệ đối tác bền vững, cùng khách hàng phát triển 
                    và đạt được mục tiêu chung.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                  <p className="text-gray-600">
                    Cam kết chất lượng cao nhất trong mọi dự án, từ khâu tư vấn đến 
                    triển khai và hỗ trợ sau bán hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Đội ngũ lãnh đạo
                </h2>
                <p className="text-xl text-gray-600">
                  Những con người tài năng đằng sau thành công của PHG Corporation
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                  <img 
                    src="/avatar.jpg" 
                    alt="CEO" 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Đỗ Phú Huy</h3>
                  <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
                  <p className="text-gray-600 text-sm">
                    Chuyên gia hàng đầu về E-commerce và Fintech tại Việt Nam. 
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                  <img 
                    src="/avatar.jpg" 
                    alt="CTO" 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nguyễn Hoàng Phi Hùng</h3>
                  <p className="text-purple-600 font-medium mb-4">CTO</p>
                  <p className="text-gray-600 text-sm">
                    7+ năm kinh nghiệm trong lĩnh vực AI và Machine Learning.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                  <img 
                    src="/avatar.jpg" 
                    alt="CMO" 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nguyễn Đăng Đạt</h3>
                  <p className="text-green-600 font-medium mb-4">CMO</p>
                  <p className="text-gray-600 text-sm">
                    5+ năm kinh nghiệm Digital Marketing và Marketing Director. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
