import { IsNotEmpty } from 'class-validator';

export class RegisterInput {
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
