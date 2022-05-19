import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'varchar', nullable: true })
  description: string | null; // Описание категории

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean; // Включена/отключена?
}
