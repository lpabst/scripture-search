import { Entity, Column, PrimaryColumn } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
export default class Scripture extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 32 })
  book: string;

  @Column({ type: "int" })
  chapter: number;

  @Column({ type: "int" })
  verse: number;

  @Column({ type: "text" })
  text: string;
}
