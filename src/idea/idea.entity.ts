import { UserEntity } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('idea')
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    @CreateDateColumn()
    created: Date;
    @UpdateDateColumn()
    updated: Date;
    name: string;
    @Column('text')
    description: string;
    @ManyToOne(type => UserEntity, author => author.ideas)
    author: UserEntity;
}