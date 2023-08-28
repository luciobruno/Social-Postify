import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MediaDTO } from './dtos/media.dto';
import { MediasService } from './medias.service';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  async createMedia(@Body() body: MediaDTO) {
    return await this.mediasService.createMedia(body);
  }
  @Get()
  async getAllMedias() {
    return await this.mediasService.findAllMedias();
  }
  @Get('/:id')
  async getMediaById(@Param('id') id: string) {
    return await this.mediasService.findMediaById(Number(id));
  }
  @Put('/:id')
  async updateMediaById(@Body() body: MediaDTO, @Param('id') id: string) {
    return await this.mediasService.updateMediaById(body, Number(id));
  }
  @Delete('/:id')
  async deleteMediaById(@Param('id') id: string) {
    return await this.mediasService.deleteMediaById(Number(id));
  }
}
