import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common'
import { AppService, RoomList } from './app.service'
import { Response } from 'express'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async main(@Res() res: Response) {
    return await this.appService.getBot(res)
  }

  @Get('login')
  async login(@Res() res: Response, @Query('force') force?: string) {
    const link = await this.appService.login(force)
    if (force) {
      res.redirect(link.split('\n')[1])
    } else {
      if (link.match('https://wechaty.js.org')) {
        res.redirect(link)
      } else {
        res.send(link)
      }
    }
  }

  @Post('send')
  sendMsg(@Body() body: { user: string; msg: string }) {
    return this.appService.sendMsg(body.user, body.msg)
  }

  @Post('sendRoom')
  sendRoomMsg(@Body() body: { list: RoomList }) {
    return this.appService.sendRoomMsg(body.list || [])
  }
}
