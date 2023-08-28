import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediasRepository } from './medias.repository';
import { MediaDTO } from './dtos/media.dto';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}

  async createMedia(data: MediaDTO) {
    const media: MediaDTO = await this.mediasRepository.findSameMedia(data);
    if (media) throw new ConflictException();
    await this.mediasRepository.createMedia(data);
  }
  async findAllMedias() {
    const medias: MediaDTO[] = await this.mediasRepository.findAllMedias();
    return medias;
  }
  async findMediaById(id: number) {
    const media: MediaDTO = await this.mediasRepository.findMediaById(id);
    if (!media) throw new NotFoundException();
    return media;
  }
  async updateMediaById(data: MediaDTO, id: number) {
    const sameMedia = await this.mediasRepository.findSameMedia(data);
    if (sameMedia) throw new ConflictException();
    const media = await this.mediasRepository.findMediaById(id);
    if (!media) throw new NotFoundException();
    await this.mediasRepository.updateMediaById(data, id);
  }
  async deleteMediaById(id: number) {
    const media = await this.mediasRepository.findMediaById(id);
    if (!media) throw new NotFoundException();
    const publication =
      await this.mediasRepository.findPublicationByMediaId(id);
    if (publication) throw new ForbiddenException();
    await this.mediasRepository.deleteMediaById(id);
  }
}
