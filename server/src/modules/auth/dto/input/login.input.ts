import { IsNotEmpty } from 'class-validator';

export class LoginInput {
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
