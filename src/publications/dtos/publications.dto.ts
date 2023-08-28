import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class PublicationDTO {
  @IsNumber()
  @IsNotEmpty({ message: 'All fields are required!' })
  mediaId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'All fields are required!' })
  postId: number;

  @IsDate()
  @IsNotEmpty({ message: 'All fields are required!' })
  date: Date;
}
