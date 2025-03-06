import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ChangePasswordInput } from './dto/input/changepass.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean();
    return user;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ googleId }).lean();
    return user;
  }

  async findById(_id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ _id }).lean();
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ username })
      .select('+password')
      .lean();
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = await this.userModel.create(data);
    return user;
  }

  async update(user: User): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .lean();
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
  ): Promise<{ success: boolean; message: string }> {
    const { oldPassword, newPassword, rePassword } = input;

    if (newPassword !== rePassword) {
      throw new BadRequestException('Mật khẩu mới không trùng khớp');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { success: true, message: 'Đổi mật khẩu thành công' };
  }
}
