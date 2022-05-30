import { Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;
}
