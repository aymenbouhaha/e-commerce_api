import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "./entity/category.entity";
import {Repository} from "typeorm";

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository : Repository<CategoryEntity>
    ) {
    }


    async getCategroyByName(name : string){
        return await this.categoryRepository.findOneBy({name : name})
    }


    async getCategories(){
        return await this.categoryRepository.find()
    }

}
