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
import { SyncService } from '../sync/sync.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly versionService: SyncService,
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
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.userService.create({
        username: data.username,
        password: hashedPassword,
        name: data.name,
      });
      await this.versionService.createVersion(user._id);
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

  async handleGoogleAuth(profile: any) {
    const email = profile.emails?.[0]?.value || null;
    const googleId = profile.id;
    const name = profile.displayName;

    let user = await this.userService.findByGoogleId(googleId);

    if (!user) {
      user = await this.userService.create({
        email,
        googleId,
        name,
      });
      await this.versionService.createVersion(user._id);
    }

    const jwtToken = this.jwtService.sign({
      userId: user._id,
    });

    return { jwtToken };
  }
}
