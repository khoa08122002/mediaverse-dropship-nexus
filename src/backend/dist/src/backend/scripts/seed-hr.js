"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash('Khoa08122002@@', 10);
    const hr = await prisma.user.upsert({
        where: { email: 'khoa@gmail.com' },
        update: {
            password: hashedPassword
        },
        create: {
            email: 'khoa@gmail.com',
            password: hashedPassword,
            fullName: 'Khoa',
            role: 'HR',
            status: 'ACTIVE'
        }
    });
    console.log('HR user updated:', hr);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-hr.js.map