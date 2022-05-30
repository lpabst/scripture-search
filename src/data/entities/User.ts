import {Entity, Column, PrimaryColumn, Index} from "typeorm";

@Entity()
export default class User {
    @PrimaryColumn({ type: "varchar", length: 32 })
    id: string;

    @Column({ type: "varchar", length: 64 })
    firstName: string;

    @Column({ type: "varchar", length: 64 })
    lastName: string;

    @Column({ type: "varchar", length: 256 })
    @Index({ unique: true })
    email: string;

    @Column({ type: "varchar", length: 256 })
    passwordHash: string;
}