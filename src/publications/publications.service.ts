import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PublicationsRepository } from './publications.repository';
import { PublicationDTO } from './dtos/publications.dto';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
  ) {}
  async createPublication(data: PublicationDTO) {
    const result = await this.publicationsRepository.findPostAndMediaById(
      data.postId,
      data.mediaId,
    );
    if (result.media === null || result.post === null) {
      throw new NotFoundException();
    }
    await this.publicationsRepository.createPublication(data);
  }
  async findAllPublications() {
    return await this.publicationsRepository.findAllPublications();
  }
  async findPublicationById(id: number) {
    const publication =
      await this.publicationsRepository.findPublicationById(id);
    if (!publication) throw new NotFoundException();
    return publication;
  }
  async updatePublicationById(data: PublicationDTO, id: number) {
    const publication =
      await this.publicationsRepository.findPublicationById(id);
    if (!publication) throw new NotFoundException();
    const date = new Date(publication.date);
    const currentDate = new Date();
    if (currentDate > date) throw new ForbiddenException();
    const result = await this.publicationsRepository.findPostAndMediaById(
      data.postId,
      data.mediaId,
    );
    if (result.media === null || result.post === null) {
      throw new NotFoundException();
    }
    await this.publicationsRepository.updatePublicationById(data, id);
  }
  async deletePublicationById(id: number) {
    const publication =
      await this.publicationsRepository.findPublicationById(id);
    if (!publication) throw new NotFoundException();
    await this.publicationsRepository.deletePublicationById(id);
  }
}
