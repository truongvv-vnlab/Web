import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginOutput } from './dto/response/login.output';
import { LoginInput } from './dto/input/login.input';
import { RegisterInput } from './dto/input/register.input';
import { RegisterOutPut } from './dto/response/register.output';

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
      throw new UnauthorizedException('Mật khẩu sai');
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

  async register(data: RegisterInput): Promise<RegisterOutPut> {
    console.log(data);
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.userService.create({
        username: data.username,
        password: hashedPassword,
        name: data.name,
      });
      console.log(user);
      const jwtToken = this.jwtService.sign({
        userId: user._id,
      });
      return {
        user: user,
        jwtToken: jwtToken,
      };
    } catch (error) {
      throw new BadRequestException('Tài khoản đã tồn tại');
    }
  }

  async handleGoogleAuth(profile: any, existingToken: string | null) {
    const email = profile.emails?.[0]?.value || null;
    const googleId = profile.id;
    const name = profile.displayName;

    // 🔹 Nếu có existingToken → Liên kết Google với user hiện tại
    if (existingToken) {
      const userData = this.jwtService.verify(existingToken); // Giải mã token để lấy userId
      const user = await this.userService.findById(userData.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Kiểm tra xem Google ID đã được liên kết với user khác chưa
      const existingGoogleUser =
        await this.userService.findByGoogleId(googleId);
      if (existingGoogleUser && existingGoogleUser._id !== user._id) {
        throw new ConflictException(
          'Google account already linked to another user',
        );
      }

      // Cập nhật tài khoản Google cho user hiện tại
      user.googleId = googleId;
      await user.save();

      return { jwtToken: existingToken }; // Giữ nguyên token cũ
    }

    // 🔹 Nếu không có existingToken → Đăng nhập hoặc đăng ký
    let user = await this.userService.findByGoogleId(googleId);

    if (!user) {
      user = await this.userService.create({
        email,
        googleId,
        name,
      });
    }

    // Tạo token mới
    const jwtToken = this.jwtService.sign({
      userId: user._id,
    });

    return { jwtToken };
  }
}
