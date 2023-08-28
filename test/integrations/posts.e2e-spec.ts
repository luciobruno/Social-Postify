import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { Post } from '../factories/posts-factory';
import { faker } from '@faker-js/faker';
import { Media } from '../factories/medias-factory';

describe('Posts E2E Tests', () => {
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

  it('POST /posts should create a new post', async () => {
    const post = new Post();
    await request(app.getHttpServer())
      .post('/posts')
      .send(post)
      .expect(HttpStatus.CREATED);
  });
  it('GET /posts should get all posts', async () => {
    await prisma.post.create({ data: new Post() });
    await prisma.post.create({ data: new Post() });
    const result = await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK);
    expect(result.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
          image: expect.any(String),
        },
      ]),
    );
  });
  it('GET /posts/:id should get a post by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const result = await request(app.getHttpServer())
      .get(`/posts/${post.id}`)
      .expect(HttpStatus.OK);
    expect(result.body).toEqual({
      id: expect.any(Number),
      title: expect.any(String),
      text: expect.any(String),
      image: expect.any(String),
    });
  });
  it('DELETE /posts/:id should delete a post by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.OK);
  });
  it('UPDATE /posts/:id should update a post by id', async () => {
    const post = await prisma.post.create({ data: new Post() });
    const newPost = new Post();
    await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .send(newPost)
      .expect(HttpStatus.OK);
  });
  describe('When body is invalid', () => {
    it('POST /posts should return 400', async () => {
      const post = { title: faker.lorem.lines() };
      await request(app.getHttpServer())
        .post('/posts')
        .send(post)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('UPDATE /posts/:id should return 400', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const newPost = { title: faker.lorem.lines() };
      await request(app.getHttpServer())
        .put(`/posts/${post.id}`)
        .send(newPost)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  describe('When id not exist', () => {
    it('GET /posts/:id should return 404', async () => {
      await prisma.post.create({ data: new Post() });
      await request(app.getHttpServer())
        .get(`/posts/${100000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('DELETE /posts/:id should return 404', async () => {
      await prisma.post.create({ data: new Post() });
      await request(app.getHttpServer())
        .delete(`/posts/${100000}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('UPDATE /posts/:id should return 404', async () => {
      await prisma.post.create({ data: new Post() });
      const newPost = new Post();
      await request(app.getHttpServer())
        .put(`/posts/${1000000}`)
        .send(newPost)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('When media exists in a publication', () => {
    it('DELETE /posts/:id should return 403', async () => {
      const post = await prisma.post.create({ data: new Post() });
      const media = await prisma.media.create({ data: new Media() });
      const publication = {
        postId: post.id,
        mediaId: media.id,
        date: '2023-11-21T13:25:17.352Z',
      };
      await prisma.publication.create({ data: publication });
      await request(app.getHttpServer())
        .delete(`/posts/${post.id}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
