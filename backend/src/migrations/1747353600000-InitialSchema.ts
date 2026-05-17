import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1747353600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rates" (
        "id"         uuid                        NOT NULL DEFAULT uuid_generate_v4(),
        "pair"       character varying           NOT NULL,
        "price"      numeric(18,8)               NOT NULL,
        "timestamp"  bigint                      NOT NULL,
        "createdAt"  TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rates" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hourly_averages" (
        "id"           uuid                        NOT NULL DEFAULT uuid_generate_v4(),
        "pair"         character varying           NOT NULL,
        "average"      numeric(18,8)               NOT NULL,
        "periodStart"  character varying           NOT NULL,
        "periodEnd"    character varying           NOT NULL,
        "createdAt"    TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hourly_averages" PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "hourly_averages"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "rates"`)
  }
}
