import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from "typeorm";

@Entity("periodic_task_status")
export class PeriodicTaskStatus{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task_name: string;

    @Column()
    frequency: string;

    @Column()
    location_id: number;

    @Column()
    area_id: number;

    @Column()
    unit_id: number;

    @Column()
    level_id: number;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    user_id: number;

    @Column()
    ref_key: string;

    @Column()
    status: string;

    @Column({ nullable: true })
    description: string;

}