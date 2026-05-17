import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { RateOrmEntity } from './rates/infrastructure/outbound/persistence/entities/rate.orm-entity'
import { HourlyAverageOrmEntity } from './rates/infrastructure/outbound/persistence/entities/hourly-average.orm-entity'

const MIGRATIONS_GLOB = process.env['NODE_ENV'] === 'production'
  ? 'dist/migrations/*.js'
  : 'src/migrations/*.ts'

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'] ?? 'postgres://postgres:postgres@localhost:5432/cryptostream',
  entities: [RateOrmEntity, HourlyAverageOrmEntity],
  migrations: [MIGRATIONS_GLOB],
  synchronize: false,
})

export { AppDataSource }
