import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from 'src/common/guards/google-auth/google-auth.guard';
import { LoginInput } from './dto/input/login.input';
import { RegisterInput } from './dto/input/register.input';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginInput, @Res() res: Response) {
    const { user, jwtToken } = await this.authService.login(loginDto);
    const cookieConfig = this.configService.get('cookie');

    res.cookie('accessToken', jwtToken, cookieConfig);

    return res.json({ user });
  }

  @Post('/register')
  async register(@Body() register: RegisterInput) {}

  @HttpCode(HttpStatus.OK)
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin(@Req() req: Request, @Res() res: Response) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email%20profile&client_id=${process.env.GOOGLE_CLIENT_ID}`;
    res.redirect(googleAuthUrl);
  }

  @HttpCode(HttpStatus.OK)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const { profile, accessToken } = req.user as any;
      const jwtToken = await this.authService.handleGoogleAuth(profile);

      const cookieConfig = this.configService.get('cookie');

      res.cookie('accessToken', jwtToken, cookieConfig);
      res.cookie('googleAccessToken', accessToken, cookieConfig);

      return res.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('google/logout')
  async googleLogout(@Req() req: Request, @Res() res: Response) {
    const googleToken = req.cookies['googleAccessToken'];

    try {
      if (googleToken) {
        await fetch(
          `https://accounts.google.com/o/oauth2/revoke?token=${googleToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        );
      }
      res.clearCookie('accessToken');
      res.clearCookie('googleAccessToken');

      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Logout failed', error });
    }
  }
}
