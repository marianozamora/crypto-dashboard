import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

const PRICE_COLUMN = { precision: 18, scale: 8 } as const

@Entity('hourly_averages')
export class HourlyAverageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', PRICE_COLUMN)
  average!: number

  @Column()
  periodStart!: string

  @Column()
  periodEnd!: string

  @CreateDateColumn()
  createdAt!: Date
}
