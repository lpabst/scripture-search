import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
export default class RefreshToken extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 32 })
  userId: string;

  @Column({ type: "varchar", length: 64 })
  @Index()
  token: string;

  @Column({ type: "date" })
  expires: Date;

  isValidForUser(userId: string) {
    if (this.expires.getTime() <= Date.now()) {
      return false;
    }

    if (userId !== this.userId) {
      return false;
    }
  }
}
