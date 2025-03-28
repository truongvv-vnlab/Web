import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Version, VersionSchema } from 'src/common/schemas/version.schema';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [UserModule, SyncModule],
  providers: [GoogleStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
  }
}
