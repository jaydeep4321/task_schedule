import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from "typeorm";

@Entity("task_template")
export class TaskTemplate{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task_name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    location: number;

    @Column()
    area: number;

    @Column()
    unit_id: number;

    @Column()
    level_id: number;

    @Column()
    ref_key: string;

    @Column()
    status: string;

    @Column()
    frequency: string;

    @Column()
    start_day: number;
    
    @Column()
    end_day: number;

    @Column({ nullable: true })
    day: string;

    @Column({ nullable: true })
    repeat_type: string;

    @Column({ nullable: true })
    start_month: string;

    @Column({ nullable: true })
    end_month: string;

    @Column()
    month_week_no: number;

    @Column()
    month_week_day: number;

    @Column()
    quarter_start_month: number;

    @Column()
    quarter_end_month: number;
    
    @Column({ nullable: true })
    quarter_start_date: string;

    @Column({ nullable: true })
    quarter_end_date: string;
}