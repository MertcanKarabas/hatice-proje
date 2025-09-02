
import { PrismaService } from 'src/prisma/prisma.service';
import { IBaseRepository } from 'src/common/interfaces/base.repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly prisma: PrismaService, protected readonly modelName: string) { }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({ where: { id }, include });
  }

  async findAll(): Promise<T[]> {
    return this.prisma[this.modelName].findMany();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.prisma[this.modelName].create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.prisma[this.modelName].update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma[this.modelName].delete({ where: { id } });
  }
}
