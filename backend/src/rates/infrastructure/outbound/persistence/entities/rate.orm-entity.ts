import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

const PRICE_COLUMN = { precision: 18, scale: 8 } as const

@Entity('rates')
export class RateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', PRICE_COLUMN)
  price!: number

  @Column('bigint')
  timestamp!: number

  @CreateDateColumn()
  createdAt!: Date
}
