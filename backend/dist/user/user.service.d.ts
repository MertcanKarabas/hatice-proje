import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
}
