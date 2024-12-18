import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async find(email: string) {
    const user = await this.userRepository.find({ where: { email: email } })
    return user[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
