import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphqlConfig } from './config/graphql.config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<MongooseModuleOptions>('db');
        if (!config) {
          throw new Error('Database not working!');
        }
        return config;
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<JwtSignOptions>('jwt');
        if (!config) {
          throw new Error('Cannot start App without JWT config');
        }
        return config;
      },
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      inject: [GraphqlConfig],
      useClass: GraphqlConfig,
    }),
    AuthModule,
    UserModule,
    // DeckModule,
    // CardModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
