import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './countries.entity';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => Country, (country) => country.id)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @Column()
  country_id: number;
}
