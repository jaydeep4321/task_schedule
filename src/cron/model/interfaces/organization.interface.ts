export interface OrganizationInterface {
  id?: number;
  name: string;
  sub_domain: string;
  address_1: string;
  address_2: string;
  city_id: number;
  state_id: number;
  country_id: number;
  pincode: string;
  status?: OrgStatus;
  nfc_status?: NFCStatus;
  logo?: string;
  client_app_logo?: string;
  module: string;
  qi_rating?: QIRatings;
  qi_star_count?: number;
  attendance_pwd?: string;
  nfc_forcefully?: OrgBoolean;
  qi_checklist?: OrgBoolean;
  pest_control?: OrgBoolean;
  attendance_compulsory?: OrgBoolean;
  pestcontol_approve_reject?: OrgBoolean;
  quality_inspection?: OrgBoolean;
  default_service_category?: OrgBoolean;
}

export enum OrgStatus {
  ACTIVE = 'Active',
  DEACTIVE = 'Deactive',
}

export enum NFCStatus {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
}

export enum QIRatings {
  STAR = 'Star',
  NUMBER = 'Number',
}

export enum OrgBoolean {
  TRUE = 'True',
  FALSE = 'False',
}
