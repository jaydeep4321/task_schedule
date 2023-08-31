export interface IPeriodicTaskStatus {

    id?: number;
    task_name: string;
    frequency: string;
    location_id: number;
    area_id: number;
    unit_id: number;
    level_id: number;
    user_id: number;
    start_date: Date;
    end_date: Date;
    ref_key: string;
    status: string;
    description: string;
    
}