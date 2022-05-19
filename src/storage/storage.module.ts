import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', '..', 'database.sql'),
      autoLoadEntities: true,
      synchronize: true, // TODO: Отключить в production
    }),
    TypeOrmModule.forFeature([CategoryEntity]),
  ],
})
export class StorageModule {}
