import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string; // Идентификатор категории

  @CreateDateColumn()
  createdDate: Date; // Дата создания

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string; // Уникальное название категории (латинскими буквами)

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string; // Название категории

  @Column({ type: 'varchar', nullable: false })
  description: string; // Описание категории

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean; // Включена/отключена?

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  searchName: string; // Индекс для поиска по названию

  @Index()
  @Column({ type: 'varchar', nullable: false })
  searchDescription: string; // Индекс для поиска по описанию

  @Index()
  @Column({ type: 'varchar', nullable: false, unique: true })
  searchNameAndDescription: string; // Индекс для поиска по описанию
}
