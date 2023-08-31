import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserArchiveBoolean, UserStatus } from "./interfaces/user.interface";
import { City } from "./cities.entity";
import { State } from "./states.entity";
import { Country } from "./countries.entity";
import { Role } from "./role.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 50, nullable: true })
  first_name: string;

  @Column({ length: 50, nullable: true })
  last_name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 15, nullable: true })
  phone_number: string;

  @Column({ length: 15, nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  address_line_1: string;

  @Column({ length: 100, nullable: true })
  address_line_2: string;

  @Column({ length: 50, nullable: true })
  street: string;

  @ManyToOne((type) => City, (city) => city.id, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city: City;

  @Column({ nullable: true })
  city_id: number;

  @ManyToOne((type) => State, (state) => state.id, { nullable: true })
  @JoinColumn({ name: "state_id" })
  state: State;

  @Column({ nullable: true })
  state_id: number;

  @ManyToOne((type) => Country, (country) => country.id, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country: Country;

  @Column({ nullable: true })
  country_id: number;

  @Column({ length: 25, nullable: true })
  pincode: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ type: "longtext", nullable: true })
  reset_password_token: string;

  @Column({ type: "datetime", nullable: true })
  reset_password_expiration: Date;

  @ManyToOne((type) => Role, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column()
  role_id: number;

  @Index()
  @Column({ nullable: true })
  org_id: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  ref_key: string;

  @Column({ default: 0 })
  is_hq_user: number;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: "varchar", length: 100, nullable: true })
  device_id: string;

  @Column({ type: "longtext", nullable: true })
  FCMtoken: string;

  @Column({ type: "longtext", nullable: true })
  hashed_rt?: string;

  @Column({
    type: "enum",
    enum: UserArchiveBoolean,
    default: UserArchiveBoolean.FALSE,
  })
  archive_qi_show: UserArchiveBoolean;

  @Column({
    type: "enum",
    enum: UserArchiveBoolean,
    default: UserArchiveBoolean.FALSE,
  })
  delete_button_access: UserArchiveBoolean;

  @Column({
    type: "enum",
    enum: UserArchiveBoolean,
    default: UserArchiveBoolean.FALSE,
  })
  archive_menu_access: UserArchiveBoolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
