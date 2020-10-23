import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The age of a cat',
  })
  username: string;

  @ApiProperty()
  password: string;
}
