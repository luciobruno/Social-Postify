import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Media } from '../factories/medias-factory';
import { Post } from '../factories/posts-factory';

describe('Publications E2E Tests', () => {
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

  it('POST /publications should create a new publication', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const media = await prisma.media.create({ data: new Media() });
    const publication = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-21T13:25:17.352Z',
    };
    await request(app.getHttpServer())
      .post('/publications')
      .send(publication)
      .expect(HttpStatus.CREATED);
  });
  it('GET /publications should get all publications', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const media = await prisma.media.create({ data: new Media() });
    const publication = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-21T13:25:17.352Z',
    };
    await prisma.publication.create({ data: publication });
    const result = await request(app.getHttpServer())
      .get('/publications')
      .expect(HttpStatus.OK);
    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        },
      ]),
    );
  });
  it('GET /publications/:id should get a publication by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const media = await prisma.media.create({ data: new Media() });
    const publication = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-21T13:25:17.352Z',
    };
    const newPublication = await prisma.publication.create({
      data: publication,
    });
    const result = await request(app.getHttpServer())
      .get(`/publications/${newPublication.id}`)
      .expect(HttpStatus.OK);
    expect(result.body).toEqual({
      id: expect.any(Number),
      mediaId: expect.any(Number),
      postId: expect.any(Number),
      date: expect.any(String),
    });
  });
  it('DELETE /publications/:id should delete a publication by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const media = await prisma.media.create({ data: new Media() });
    const publication = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-21T13:25:17.352Z',
    };
    const newPublication = await prisma.publication.create({
      data: publication,
    });
    await request(app.getHttpServer())
      .delete(`/publications/${newPublication.id}`)
      .expect(HttpStatus.OK);
  });
  it('UPDATE /publications/:id should update a publication by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const media = await prisma.media.create({ data: new Media() });
    const publication = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-21T13:25:17.352Z',
    };
    const newPublication = await prisma.publication.create({
      data: publication,
    });
    const newUpdate = {
      postId: post.id,
      mediaId: media.id,
      date: '2023-11-25T13:25:17.352Z',
    };
    await request(app.getHttpServer())
      .put(`/publications/${newPublication.id}`)
      .send(newUpdate)
      .expect(HttpStatus.OK);
  });
  describe('When body is invalid', () => {
    it('POST /publications should return 400', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
      };
      await request(app.getHttpServer())
        .post('/publications')
        .send(publication)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('UPDATE /publications/:id should return 400', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      const newPublication = await prisma.publication.create({
        data: publication,
      });
      const newUpdate = {
        postId: post.id,
        mediaId: media.id,
      };
      await request(app.getHttpServer())
        .put(`/publications/${newPublication.id}`)
        .send(newUpdate)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  describe('When id not exist', () => {
    it('GET /publications/:id should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await prisma.publication.create({
        data: publication,
      });
      await request(app.getHttpServer())
        .get(`/publications/${100000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('DELETE /publications/:id should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await prisma.publication.create({
        data: publication,
      });
      await request(app.getHttpServer())
        .delete(`/publications/${10000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('UPDATE /publications/:id should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await prisma.publication.create({
        data: publication,
      });
      const newUpdate = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-25T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .put(`/publications/${100000}`)
        .send(newUpdate)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe("When doesn't exist mediaId or PostId", () => {
    it('POST /publications should return 404', async () => {
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: 999999,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .post('/publications')
        .send(publication)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('POST /publications should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const publication = {
        postId: post.id,
        mediaId: 999999,
        date: '2023-11-21T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .post('/publications')
        .send(publication)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('UPDATE /publications/:id should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      const newPublication = await prisma.publication.create({
        data: publication,
      });
      const newUpdate = {
        postId: 9999999,
        mediaId: media.id,
        date: '2023-11-25T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .put(`/publications/${newPublication.id}`)
        .send(newUpdate)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('UPDATE /publications/:id should return 404', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      const newPublication = await prisma.publication.create({
        data: publication,
      });
      const newUpdate = {
        postId: post.id,
        mediaId: 999999,
        date: '2023-11-25T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .put(`/publications/${newPublication.id}`)
        .send(newUpdate)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('When a publication has already been published', () => {
    it('UPDATE /publications/:id should return 403', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-07-21T13:25:17.352Z',
      };
      const newPublication = await prisma.publication.create({
        data: publication,
      });
      const newUpdate = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-25T13:25:17.352Z',
      };
      await request(app.getHttpServer())
        .put(`/publications/${newPublication.id}`)
        .send(newUpdate)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
