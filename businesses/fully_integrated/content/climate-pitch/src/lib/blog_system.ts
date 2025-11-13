import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

interface CreateBlogPostDto {
  title: string;
  content: string;
  tags: string[];
}

class CreateBlogPost {
  constructor(private readonly dto: CreateBlogPostDto) {}

  async execute() {
    const errors = await validate(this.dto);
    if (errors.length > 0) {
      throw new Error('Invalid data provided');
    }

    const validatedData = plainToClass(CreateBlogPostDto, this.dto);

    // Perform validation checks on the data, e.g., check if tags are unique

    // Save the blog post to the database

    return validatedData;
  }
}

export { CreateBlogPost };

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

interface CreateBlogPostDto {
  title: string;
  content: string;
  tags: string[];
}

class CreateBlogPost {
  constructor(private readonly dto: CreateBlogPostDto) {}

  async execute() {
    const errors = await validate(this.dto);
    if (errors.length > 0) {
      throw new Error('Invalid data provided');
    }

    const validatedData = plainToClass(CreateBlogPostDto, this.dto);

    // Perform validation checks on the data, e.g., check if tags are unique

    // Save the blog post to the database

    return validatedData;
  }
}

export { CreateBlogPost };