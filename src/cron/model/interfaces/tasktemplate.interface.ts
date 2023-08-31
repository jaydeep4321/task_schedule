export interface ITaskTemplateBody {

  id?: number;
  task_name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: number;
  area: number;
  unit_id: number;
  level_id: number;
  ref_key: string;
  status: string;
  frequency: string;
  start_day: number;
  end_day: number;
  day: string;
  repeat_type: string;
  start_month: string;
  end_month: string;
  month_week_no: number;
  month_week_day: number;
  quarter_start_month: number;
  quarter_end_month: number;
  quarter_start_date: string
  quarter_end_date: string;
  }