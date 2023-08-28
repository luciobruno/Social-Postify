import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicationDTO } from './dtos/publications.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPublication(data: PublicationDTO) {
    await this.prisma.publication.create({ data: data });
  }
  async findAllPublications() {
    await this.prisma.publication.findMany();
  }
  async findPublicationById(id: number) {
    await this.prisma.publication.findFirst({ where: { id } });
  }
  async deletePublicationById(id: number) {
    await this.prisma.publication.delete({ where: { id } });
  }
  async updatePublicationById(data: PublicationDTO, id: number) {
    await this.prisma.publication.update({ where: { id }, data: data });
  }
}
