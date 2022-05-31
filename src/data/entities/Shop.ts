import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
export default class Shop extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 32 })
  userId: string;

  @Column({ type: "varchar", length: 256 })
  name: string;

  @Column({ type: "varchar", length: 2048 })
  @Index({ unique: true })
  description: string;

  @Column({ type: "varchar", length: 1024, nullable: true })
  imageUrl?: string;

  // routing numbers are always 9 digits long
  @Column({ type: "varchar", length: 16, nullable: true })
  ACHRoutingNumber: string;

  // account numbers can be up to 17 digits long
  @Column({ type: "varchar", length: 32, nullable: true })
  ACHAccountNumber: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  websiteUrl: string;
}
