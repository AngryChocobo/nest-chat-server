import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.model';
const SECRET_KEY = 'awd';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    Logger.log('Token 鉴权ing' + JSON.stringify(request));
    return this.validateRequest();
  }

  async validateRequest(): Promise<boolean> {
    // return !!request;
    // const token = String(request.headers.authorization);
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDgsImlhdCI6MTYwMzQ0ODU5Mn0.-Tb5tB_BDT74s7bAPVjksK6Zh2Ao677j06A5Pu_WjcQ';
    return jwt.verify(token, SECRET_KEY, (jwtError, data) => {
      if (jwtError) {
        throw new HttpException('登录失效', HttpStatus.UNAUTHORIZED);
      } else {
        // 判断有没有这个用户
        User.findOne({
          where: {
            id: data.id,
          },
        }).then(loggedInUser => {
          if (!loggedInUser) {
            throw new HttpException('登录失效', HttpStatus.UNAUTHORIZED);
          } else {
            Logger.log('允许登录');
            return true;
          }
        });
      }
    });
  }
}
