import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationDTO } from './dtos/publications.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}
  @Post()
  async createPublication(@Body() body: PublicationDTO) {
    return await this.publicationsService.createPublication(body);
  }
  @Get()
  async findAllPublications() {
    return await this.publicationsService.findAllPublications();
  }
  @Get('/:id')
  async findPublicationById(@Param('id') id: string) {
    return await this.publicationsService.findPublicationById(Number(id));
  }
  @Delete('/:id')
  async deletePublicationById(@Param('id') id: string) {
    return await this.publicationsService.deletePublicationById(Number(id));
  }
  @Put('/:id')
  async updatePublicationById(
    @Body() body: PublicationDTO,
    @Param('id') id: string,
  ) {
    return await this.publicationsService.updatePublicationById(
      body,
      Number(id),
    );
  }
}
