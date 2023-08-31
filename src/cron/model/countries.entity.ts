import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, select: false })
  sortname: string;

  @Column({ unique: true })
  name: string;

  @Column({ select: false })
  phonecode: number;
}
