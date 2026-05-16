import 'tsconfig-paths/register'
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import type { Env } from './shared/config/env.validation'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<Env, true>)
  const logger = new Logger('Bootstrap')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableShutdownHooks()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cryptostream API')
    .setDescription(
      'Real-time cryptocurrency exchange rates for ETH/USDC, ETH/USDT and ETH/BTC',
    )
    .setVersion('1.0')
    .addTag('health', 'API health and connectivity status')
    .addTag('rates', 'Real-time exchange rate data')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  app.enableCors({
    origin: configService.get('FRONTEND_URL', { infer: true }),
    methods: ['GET', 'POST'],
    credentials: true,
  })

  const port = configService.get('PORT', { infer: true })
  await app.listen(port)
  logger.log(JSON.stringify({ event: 'app_started', port, timestamp: new Date().toISOString() }))
}

bootstrap()
