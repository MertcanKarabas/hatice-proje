"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    async findById(id) {
        return this.prisma[this.modelName].findUnique({ where: { id } });
    }
    async findAll() {
        return this.prisma[this.modelName].findMany();
    }
    async create(data) {
        return this.prisma[this.modelName].create({ data });
    }
    async update(id, data) {
        return this.prisma[this.modelName].update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma[this.modelName].delete({ where: { id } });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map