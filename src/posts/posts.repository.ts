import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostDTO } from './dtos/posts.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(data: PostDTO) {
    await this.prisma.post.create({ data: data });
  }
  async findAllPosts() {
    await this.prisma.post.findMany({});
  }
  async findPostById(id: number) {
    await this.prisma.post.findFirst({ where: { id } });
  }
  async deletePostById(id: number) {
    await this.prisma.post.delete({ where: { id } });
  }
  async updatePostById(data: PostDTO, id: number) {
    await this.prisma.post.update({ where: { id }, data: data });
  }
}
