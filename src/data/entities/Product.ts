import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
@Index(["userId", "price"])
@Index(["userId", "createdAt"])
@Index(["shopId", "price"])
@Index(["shopId", "createdAt"])
export default class Product extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 32 })
  userId: string;

  @Column({ type: "varchar", length: 32 })
  shopId: string;

  @Column({ type: "varchar", length: 512 })
  name: string;

  @Column({ type: "varchar", length: 8192 })
  description: string;

  @Column("decimal", { precision: 15, scale: 2 })
  price: string;

  @Column("decimal", { precision: 15, scale: 2 })
  weightOunces: string;
}
