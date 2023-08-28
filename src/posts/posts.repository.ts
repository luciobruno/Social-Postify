import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostDTO } from './dtos/posts.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(data: PostDTO) {
    return await this.prisma.post.create({ data: data });
  }
  async findAllPosts() {
    return await this.prisma.post.findMany({});
  }
  async findPostById(id: number) {
    return await this.prisma.post.findFirst({ where: { id } });
  }
  async deletePostById(id: number) {
    return await this.prisma.post.delete({ where: { id } });
  }
  async updatePostById(data: PostDTO, id: number) {
    return await this.prisma.post.update({ where: { id }, data: data });
  }
}
