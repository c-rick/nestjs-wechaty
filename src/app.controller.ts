import { Controller, Get, Post, Body, Res } from '@nestjs/common'
import { AppService, RoomList } from './app.service'
import { WechatyInterface } from 'wechaty/impls'
import { Response } from 'express'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async main(@Res() res: Response): Promise<WechatyInterface | string> {
    return await this.appService.getBot(res)
  }

  @Get('login')
  async login(): Promise<string> {
    return await this.appService.login()
  }

  @Post('send')
  sendMsg(@Body() body: { user: string; msg: string }) {
    return this.appService.sendMsg(body.user, body.msg)
  }

  @Post('sendRoom')
  sendRoomMsg(@Body() body: { list: RoomList }) {
    return this.appService.sendRoomMsg(body.list)
  }
}
