import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
  } from 'typeorm';
import { TaskTemplate } from './task-template.entity';
import { User } from './user.entity';

@Entity('scheduler_task_entry')
export class SchedulerTaskEntry{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    periodic_task_id: number;

    @OneToOne((type) => TaskTemplate, (tasktemplate) => tasktemplate.id)
    @JoinColumn({ name: "periodic_task_id" })
    tasktemplate: TaskTemplate;

    @Column()
    assignee_id: number;

    @OneToOne((type) => User, (user) => user.id)
    @JoinColumn({ name: "assignee_id" })
    user: User;

    @Column()
    ref_key: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    task_count: number;

    @Column()
    type: string;

    @Column()
    status: string;

    @Column()
    scheduler_flag: string;

    @Column()
    error: string;

}