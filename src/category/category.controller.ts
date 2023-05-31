import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  @Get()
  async getCategoryByName(@Query() name: string) {
    return await this.categoryService.getCategroyByName(name);
  }
}
