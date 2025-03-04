import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from 'src/common/guards/google-auth/google-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin(@Req() req: Request, @Res() res: Response) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=email%20profile&client_id=${process.env.GOOGLE_CLIENT_ID}`;
    res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const { profile } = req.user as any;

    console.log(profile);
    const payload = {
      email: profile.emails[0].value,
      sub: profile.id,
    };

    const jwtToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    res.cookie('accessToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.redirect('http://localhost:3000/dashboard');
  }
}
