import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  generateToken(userId: number) {
    const payload = { userId }
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "1h",
      secret: process.env.JWT_SECRET
    })
    return {
      accessToken
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.usersService.find(email)
    if (user) {
      throw new BadRequestException('User already exists. Please sign in.');
    }
    createUserDto.password = await bcrypt.hash(password, 10)
    const newUser = await this.usersService.create(createUserDto)

    const { accessToken } = this.generateToken(newUser.id)

    return {
      accessToken
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const { accessToken } = this.generateToken(user.id)

    return {
      accessToken
    }
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET
    });
  }

  async signout(userId: number) {
    console.log(userId);
    //await this.redisService.deleteRefreshToken(userId);
    return 'signout success';
  }
}
