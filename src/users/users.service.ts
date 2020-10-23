import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as NodeRSA from 'node-rsa';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    return user.save();
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const RSAPrivateKey = process.env.RSA_PRIVATE_KEY;
    const key = new NodeRSA(RSAPrivateKey);
    key.setOptions({ encryptionScheme: 'pkcs1' }); // jsencrypt使用pkcs1

    const { username, password } = registerUserDto;
    const user = await User.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException('用户名已被注册', HttpStatus.FORBIDDEN);
    } else {
      // 用私钥对密码进行加密，之后进行加盐
      const decryptedPassword = key.decrypt(password, 'utf8');
      // Logger.log('RSA解密后:' + decryptedPassword);
      const hashedPassword = bcrypt.hashSync(
        decryptedPassword,
        bcrypt.genSaltSync(10),
      );
      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      return user.save();
    }
  }

  async findAll(): Promise<User[]> {
    try {
      await this.sequelize.transaction(async t => {
        const transactionHost = { transaction: t };

        await this.userModel.create(
          { username: 'Abraham', password: 'Lincoln' },
          transactionHost,
        );
      });
    } catch (err) {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
    }
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
