import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
export default class EmailVerificationToken extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 32 })
  userId: string;

  @Column({ type: "varchar", length: 64 })
  @Index()
  token: string;

  isValidForUser(userId: string) {
    if (userId !== this.userId) {
      return false;
    }
  }
}
