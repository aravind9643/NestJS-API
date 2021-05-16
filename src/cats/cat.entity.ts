import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, })
  name: string;

  @Column()
  age: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  userId: string;

}
