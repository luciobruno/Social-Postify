import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Media } from '../factories/medias-factory';
import { faker } from '@faker-js/faker';
import { Post } from '../factories/posts-factory';

describe('Medias E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await prisma.publication.deleteMany();
    await prisma.media.deleteMany();
    await prisma.post.deleteMany();

    await app.init();
  });

  it('POST /medias should create a new media', async () => {
    const media = new Media();
    await request(app.getHttpServer())
      .post('/medias')
      .send(media)
      .expect(HttpStatus.CREATED);
  });
  it('GET /medias should get all medias', async () => {
    await prisma.media.create({ data: new Media() });
    await prisma.media.create({ data: new Media() });
    const result = await request(app.getHttpServer())
      .get('/medias')
      .expect(HttpStatus.OK);
    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          username: expect.any(String),
        },
      ]),
    );
  });
  it('GET /medias/:id should get a media by id', async () => {
    const media = await prisma.media.create({ data: new Media() });
    const result = await request(app.getHttpServer())
      .get(`/medias/${media.id}`)
      .expect(HttpStatus.OK);
    expect(result.body).toEqual({
      id: expect.any(Number),
      title: expect.any(String),
      username: expect.any(String),
    });
  });
  it('DELETE /medias/:id should delete a media by id', async () => {
    const media = await prisma.media.create({ data: new Media() });
    await request(app.getHttpServer())
      .delete(`/medias/${media.id}`)
      .expect(HttpStatus.OK);
  });
  it('UPDATE /medias/:id should update a media by id', async () => {
    const media = await prisma.media.create({ data: new Media() });
    const newMedia = new Media();
    await request(app.getHttpServer())
      .put(`/medias/${media.id}`)
      .send(newMedia)
      .expect(HttpStatus.OK);
  });
  describe('When body is invalid', () => {
    it('POST /medias should return 400', async () => {
      const media = { title: faker.lorem.lines() };
      await request(app.getHttpServer())
        .post('/medias')
        .send(media)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('UPDATE /medias/:id should return 400', async () => {
      const media = await prisma.media.create({ data: new Media() });
      const newMedia = { title: faker.lorem.lines() };
      await request(app.getHttpServer())
        .put(`/medias/${media.id}`)
        .send(newMedia)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  describe('When id not exist', () => {
    it('GET /medias/:id should return 404', async () => {
      await prisma.media.create({ data: new Media() });
      await request(app.getHttpServer())
        .get(`/medias/${100000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('DELETE /medias/:id should return 404', async () => {
      await prisma.media.create({ data: new Media() });
      await request(app.getHttpServer())
        .delete(`/medias/${100000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('UPDATE /medias/:id should return 404', async () => {
      await prisma.media.create({ data: new Media() });
      const newMedia = new Media();
      await request(app.getHttpServer())
        .put(`/medias/${1000000}`)
        .send(newMedia)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('When a media already exists on database', () => {
    it('POST /medias should return 409', async () => {
      const media = await prisma.media.create({ data: new Media() });
      await request(app.getHttpServer())
        .post('/medias')
        .send(media)
        .expect(HttpStatus.CONFLICT);
    });
    it('UPDATE /medias/:id should return 409', async () => {
      const media = await prisma.media.create({ data: new Media() });
      await request(app.getHttpServer())
        .put(`/medias/${media.id}`)
        .send(media)
        .expect(HttpStatus.CONFLICT);
    });
  });
  describe('When media exists in a publication', () => {
    it('DELETE /medias/:id should return 403', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await prisma.publication.create({ data: publication });
      await request(app.getHttpServer())
        .delete(`/medias/${media.id}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
