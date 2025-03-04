// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = this.getRequest(context);
//     const token = this.extractTokenFromCookie(request);

//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: this.configService.get<string>('JWT_SECRET'),
//       });

//       request.user = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromCookie(request: Request): string | undefined {
//     return request.cookies?.access_token;
//   }

//   private getRequest(context: ExecutionContext): Request {
//     if (context.getType() === 'http') {
//       return context.switchToHttp().getRequest();
//     } else if (context.getType() === 'graphql') {
//       return context.getArgByIndex(2).req;
//     }
//     throw new UnauthorizedException();
//   }
// }
