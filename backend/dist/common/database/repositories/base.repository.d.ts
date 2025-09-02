import { PrismaService } from 'src/prisma/prisma.service';
import { IBaseRepository } from 'src/common/interfaces/base.repository.interface';
export declare abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected readonly prisma: PrismaService;
    protected readonly modelName: string;
    constructor(prisma: PrismaService, modelName: string);
    findById(id: string, include?: any): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
}
