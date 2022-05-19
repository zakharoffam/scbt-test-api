import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { CategoriesModule } from './сategories/categories.module';

@Module({
  imports: [StorageModule, CategoriesModule],
})
export class AppModule {}
