import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDTO } from './dtos/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async createPost(@Body() body: PostDTO) {
    return await this.postsService.createPost(body);
  }
  @Get()
  async findAllPosts() {
    return await this.postsService.findAllPosts();
  }
  @Get('/:id')
  async findPostById(@Param('id') id: string) {
    return await this.postsService.findPostById(Number(id));
  }
  @Put('/:id')
  async updatePostById(@Body() body: PostDTO, @Param('id') id: string) {
    return await this.postsService.updatePostById(body, Number(id));
  }
  @Delete('/:id')
  async deletePostById(@Param('id') id: string) {
    return await this.postsService.deletePostById(Number(id));
  }
}
