import { PrismaClient } from '../generated/prisma'; // Adjusted import path
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
    // Hash a password for your admin user
    const password = await bcrypt.hash(
        'adminHatice.', // <-- ‼️ CHANGE THIS to a secure password
        roundsOfHashing,
    );

    // Create the admin user if they don't already exist
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@hatice.com' },
        update: {},
        create: {
            email: 'admin@hatice.com',
            name: 'Admin User',
            password: password,
        },
    });
    console.log('Admin user has been created or already existed:', adminUser);
}

// Run the seed script
main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });