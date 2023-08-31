

export interface ISchedulerTaskEntry{

    id?: number;
    periodic_task_id?: number;
    assignee_id?: number;
    ref_key?: string;
    start_date?: Date;
    end_date?: Date;
    task_count?: number;
    type?: string;
    status?: string;
    scheduler_flag?: string;
    error?: string;

}