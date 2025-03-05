import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginOutput } from './dto/response/login.output';
import { LoginInput } from './dto/input/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(data: LoginInput): Promise<LoginOutput> {
    const user = await this.userService.findByUsername(data.username);
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }
    const isCorrectPassword = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const jwtToken = this.jwtService.sign({
      userId: user._id,
    });

    const { password, ...userData } = user;

    return {
      user: userData,
      jwtToken: jwtToken,
    };
  }

  async handleGoogleAuth(profile: any) {
    const email = profile.emails?.[0]?.value || null;
    const googleId = profile.id;
    const name = profile.displayName;

    let user = await this.userService.findByGoogleId(googleId);

    if (!user) {
      // Nếu không tìm thấy user theo Google ID, kiểm tra theo email (nếu có)
      if (email) {
        user = await this.userService.findByEmail(email);
        if (user) {
          // Nếu tài khoản đã tồn tại nhưng chưa liên kết Google → Cập nhật Google ID
          if (!user.googleId) {
            user.googleId = googleId;
            await this.userService.update(user);
          } else {
            throw new Error('Google account mismatch');
          }
        }
      }
      // Nếu user vẫn không tồn tại → Tạo tài khoản mới
      if (!user) {
        user = await this.userService.create({
          email,
          googleId,
          name,
        });
      }
    } else if (user.googleId !== googleId) {
      throw new Error('Google account mismatch');
    }

    // Tạo JWT Token
    const jwtToken = this.jwtService.sign({
      userId: user._id,
    });

    return jwtToken;
  }
}
