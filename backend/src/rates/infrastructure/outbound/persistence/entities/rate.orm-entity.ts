import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('rates')
export class RateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  pair!: string

  @Column('decimal', { precision: 18, scale: 8 })
  price!: number

  @Column('bigint')
  timestamp!: number

  @CreateDateColumn()
  createdAt!: Date
}
