import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('rates')
export class RateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', { precision: 20, scale: 8 })
  price!: number

  @Column('bigint')
  timestamp!: number
}
