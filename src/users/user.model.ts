import { Column, Model, Table } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Exclude({ toPlainOnly: true }) // 仅在返回json时过滤，也就相当于作为response时过滤
  @Column
  password: string;

  @Column
  nickname: string;

  @Column
  avatar: string;

  // @Column({ defaultValue: true })
  // isActive: boolean;
}
