import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('/signup')
	async signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.signUp(createUserDto);
	}

	@Post('/login')
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@UseGuards(AuthGuard)
	@Get('/test')
	async testCheck() {
		return 'Authenticated'
	}
}
