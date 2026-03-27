import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    startDate!: string;

    @Column()
    endDate!: string;

    @Column({ default: "Pendente" })
    status!: string;

    @Column()
    userId!: number;
}