import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaDTO } from './dtos/media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createMedia(data: MediaDTO) {
    return await this.prisma.media.create({ data: data });
  }
  async findAllMedias() {
    return await this.prisma.media.findMany();
  }
  async findMediaById(id: number) {
    return await this.prisma.media.findFirst({ where: { id } });
  }
  async deleteMediaById(id: number) {
    return await this.prisma.media.delete({ where: { id } });
  }
  async updateMediaById(data: MediaDTO, id: number) {
    return await this.prisma.media.update({ where: { id }, data: data });
  }
  async findSameMedia(data: MediaDTO) {
    return await this.prisma.media.findFirst({
      where: {
        title: data.title,
        username: data.username,
      },
    });
  }
}
