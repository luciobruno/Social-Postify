import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicationDTO } from './dtos/publications.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPublication(data: PublicationDTO) {
    return await this.prisma.publication.create({ data: data });
  }
  async findAllPublications() {
    return await this.prisma.publication.findMany();
  }
  async findPublicationById(id: number) {
    return await this.prisma.publication.findFirst({ where: { id } });
  }
  async deletePublicationById(id: number) {
    return await this.prisma.publication.delete({ where: { id } });
  }
  async updatePublicationById(data: PublicationDTO, id: number) {
    return await this.prisma.publication.update({ where: { id }, data: data });
  }
  async findPostAndMediaById(postId: number, mediaId: number) {
    const post = await this.prisma.post.findFirst({ where: { id: postId } });
    const media = await this.prisma.media.findFirst({ where: { id: mediaId } });
    return { media, post };
  }
}
