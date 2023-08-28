import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostDTO } from './dtos/posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async createPost(data: PostDTO) {
    await this.postsRepository.createPost(data);
  }
  async findAllPosts() {
    return await this.postsRepository.findAllPosts();
  }
  async findPostById(id: number) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return post;
  }
  async updatePostById(data: PostDTO, id: number) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    await this.postsRepository.updatePostById(data, id);
  }
  async deletePostById(id: number) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    const publication = await this.postsRepository.findPublicationByPostId(id);
    if (publication) throw new ForbiddenException();
    await this.postsRepository.deletePostById(id);
  }
}
