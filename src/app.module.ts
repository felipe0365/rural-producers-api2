import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProducersModule } from './producers/producers.module'
import { FarmsModule } from './farms/farms.module'
import { CultureModule } from './culture/culture.module'
import { PlantedCropsModule } from './planted-crops/planted-crops.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST')
        const dbUsername = configService.get<string>('DB_USERNAME')

        if (!dbHost || !dbUsername) {
          return {
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
          }
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: configService.get<number>('DB_PORT'),
          username: dbUsername,
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        }
      },
    }),
    ProducersModule,
    FarmsModule,
    CultureModule,
    PlantedCropsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
