import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('hourly_averages')
export class HourlyAverageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', { precision: 20, scale: 8 })
  average!: number

  @Column()
  periodStart!: string

  @Column()
  periodEnd!: string
}
