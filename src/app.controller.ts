import { Controller, Get, Post, Body } from '@nestjs/common'
import { AppService, RoomList } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello()
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
