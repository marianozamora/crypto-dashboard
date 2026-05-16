import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('hourly_averages')
export class HourlyAverageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', { precision: 18, scale: 8 })
  average!: number

  @Column()
  periodStart!: string

  @Column()
  periodEnd!: string

  @CreateDateColumn()
  createdAt!: Date
}
