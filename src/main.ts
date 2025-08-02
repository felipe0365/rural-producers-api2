import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as crypto from 'crypto'

if (!global.crypto) {
  global.crypto = crypto as any
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api', {
    exclude: ['healthcheck'],
  })

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('API de Produtores Rurais')
    .setDescription('API para gerenciamento de produtores rurais, fazendas, culturas e safras plantadas')
    .setVersion('1.0')
    .addTag('produtores', 'Operações relacionadas aos produtores rurais')
    .addTag('fazendas', 'Operações relacionadas às fazendas')
    .addTag('culturas', 'Operações relacionadas às culturas agrícolas')
    .addTag('safras-plantadas', 'Operações relacionadas às safras plantadas')
    .addTag('dashboard', 'Operações relacionadas ao dashboard e relatórios')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API de Produtores Rurais - Documentação',
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
