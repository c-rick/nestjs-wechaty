import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common'
import { AppService, RoomList } from './app.service'
import { Response } from 'express'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async main(@Res() res: Response) {
    await this.appService.getBot(res)
  }

  @Get('login')
  async login(@Query('force') force?: string): Promise<string> {
    return await this.appService.login(force)
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
