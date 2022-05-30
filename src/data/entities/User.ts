import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export default class User {
    @PrimaryColumn()
    id: string;

    @Column({ type: "varchar", length: 64 })
    firstName: string;

    @Column({ type: "varchar", length: 64 })
    lastName: string;

    @Column({ type: "varchar", length: 256 })
    email: string;

    @Column({ type: "varchar", length: 256 })
    passwordHash: string;
}