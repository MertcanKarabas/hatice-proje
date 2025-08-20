import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@hatice.com' },
        update: {},
        create: {
            email: 'admin@hatice.com',
            name: 'Admin User',
            password: 'Haticeadmin.',
        },
    });

    console.log('Admin user has been created or already existed:', adminUser);
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });