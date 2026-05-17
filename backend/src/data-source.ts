import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { RateOrmEntity } from './rates/infrastructure/outbound/persistence/entities/rate.orm-entity'
import { HourlyAverageOrmEntity } from './rates/infrastructure/outbound/persistence/entities/hourly-average.orm-entity'

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'] ?? 'postgres://postgres:postgres@localhost:5432/cryptostream',
  entities: [RateOrmEntity, HourlyAverageOrmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
})

export { AppDataSource }
