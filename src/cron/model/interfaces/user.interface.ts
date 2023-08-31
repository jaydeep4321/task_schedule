import { OrganizationInterface } from "./organization.interface";
import { RoleInterface } from "./role.interface";

export interface UserInterface {
  id?: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  phone_number?: string;
  gender?: string;
  address_line_1?: string;
  address_line_2?: string;
  street?: string;
  city_id?: number;
  state_id?: number;
  country_id?: number;
  pincode?: string;
  profile_image?: string;
  reset_password_token?: string;
  reset_password_expiration?: Date;
  role_id: number;
  role?: RoleInterface;
  org_id?: number;
  org?: OrganizationInterface;
  reg_key?: string;
  is_hq_user?: number;
  status?: UserStatus;
  device_id?: string;
  FCMtoken?: string;
  hashed_rt?: string;
  archive_qi_show: UserArchiveBoolean;
  delete_button_access: UserArchiveBoolean;
  archive_menu_access: UserArchiveBoolean;
}

export enum UserStatus {
  ACTIVE = "Active",
  DEACTIVE = "Deactive",
}

export enum UserArchiveBoolean {
  TRUE = "true",
  FALSE = "false",
}
