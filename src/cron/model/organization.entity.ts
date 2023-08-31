import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  NFCStatus,
  OrgBoolean,
  OrgStatus,
  QIRatings,
} from './interfaces/organization.interface';
import { City } from './cities.entity';
import { State } from './states.entity';
import { Country } from './countries.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  sub_domain: string;

  @Column({ type: 'varchar', length: 100 })
  address_1: string;

  @Column({ type: 'varchar', length: 100 })
  address_2: string;

  @ManyToOne((type) => City, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  city_id: number;

  @ManyToOne((type) => State, (state) => state.id)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column()
  state_id: number;

  @ManyToOne((type) => Country, (country) => country.id)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column()
  country_id: number;

  @Column({ type: 'varchar', length: 25 })
  pincode: string;

  @Column({ type: 'enum', enum: OrgStatus, default: OrgStatus.ACTIVE })
  status: OrgStatus;

  @Column({ type: 'enum', enum: NFCStatus, default: NFCStatus.DISABLED })
  nfc_status: NFCStatus;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @Column({ type: 'varchar', nullable: true })
  client_app_logo: string;

  @Column({ type: 'varchar', length: 15 })
  module: string;

  @Column({ type: 'enum', enum: QIRatings, default: QIRatings.STAR })
  qi_rating: QIRatings;

  @Column({ nullable: true, default: 5 })
  qi_star_count: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  attendance_pwd: string;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  nfc_forcefully: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  qi_checklist: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  pest_control: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  attendance_compulsory: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  pestcontol_approve_reject: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.FALSE })
  quality_inspection: OrgBoolean;

  @Column({ type: 'enum', enum: OrgBoolean, default: OrgBoolean.TRUE })
  default_service_category: OrgBoolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
