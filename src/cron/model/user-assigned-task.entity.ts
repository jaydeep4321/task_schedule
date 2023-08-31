import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
  } from "typeorm";
import { User } from "./user.entity";
import { TaskTemplate } from "./task-template.entity";

@Entity("user_assigned_to_task")
export class UserAssignedToTask{

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => TaskTemplate, (tasktemplate) => tasktemplate.id)
    @JoinColumn({ name: "task_id" })
    tasktemplate: TaskTemplate;

    @Column()
    task_id: number;

    @OneToOne((type) => User, (user) => user.id)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    user_id: number;

    @Column()
    active: string;
 
}



