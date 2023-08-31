import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { State } from './states.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => State, (state) => state.id)
  @JoinColumn({ name: "state_id" })
  state: State;

  @Column()
  state_id: number;
}
