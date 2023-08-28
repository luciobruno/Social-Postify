import { faker } from '@faker-js/faker';

export class Post {
  title: string;
  text: string;
  image?: string;
  constructor() {
    this.title = faker.lorem.lines();
    this.text = faker.lorem.text();
    this.image = faker.image.url();
  }
}
