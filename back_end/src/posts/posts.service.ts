import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll() {
    let findAllTruePosts = await this.knex
      .select('*')
      .from('posts')
      .where('is_pending_in', true);
    return findAllTruePosts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let updatePostInfo = await this.knex('posts')
      .update({
        post_title: updatePostDto.postTitle,
        post_description: updatePostDto.postDescription,
        is_pending_out: true,
      })
      .where('id', updatePostDto.postId);
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
