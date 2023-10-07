import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import * as fs from 'fs';
import {FileInterceptor} from '@nestjs/platform-express';
import { UserDto } from './dto/add-user.dto';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(@Req() req : Request) {
    // const cookie = req.cookies['jwt'];
    // if (!cookie || !this.userService.verify(cookie))
    //     throw new UnauthorizedException();
    return this.userService.getAll();
  }


  @Get(':login')
  getUser(@Param('login') login : string, @Req() req : Request) {
    // const cookie = req.cookies['jwt'];

    // if (!cookie || !this.userService.verify(cookie))
    //     throw new UnauthorizedException();
    return this.userService.getUser(login);
  }

  @Get(':id')
  getUserById(@Param('id') id : number, @Req() req : Request) {
    // const cookie = req.cookies['jwt'];

    // if (!cookie || !this.userService.verify(cookie))
    //     throw new UnauthorizedException();
    return this.userService.getUserById(id);
  }

  @Post('')
  add(@Body() adduser : UserDto, @Req() req : Request) {
    // const cookie = req.cookies['jwt'];

    // if (!cookie || !this.userService.verify(cookie))
    //     throw new UnauthorizedException();
    return this.userService.create(adduser);
  }

  @Put()
  updateUser(@Body() user : UserDto, @Req() req : Request) {
    // const cookie = req.cookies['jwt'];
    // if (!cookie || !this.userService.verify(cookie))
    //     throw new UnauthorizedException();

    return this.userService.update(user);
  }
  
  @Post('/image/:imageName')
  @UseInterceptors(FileInterceptor('file'))
  getImage(@Param('imageName') imageName : string, @UploadedFile() file: Express.Multer.File) {
    fs.writeFileSync(`/data/`+imageName, file.buffer);
    return "OK";
  }
}
