import { Injectable, Logger } from '@nestjs/common'
import { WechatyBuilder } from 'wechaty'
import { ContactInterface, WechatyInterface } from 'wechaty/impls'
import { Response } from 'express'
import { Email } from './common/emailTool'

export type RoomList = {
  titleList: string[]
  receivedContent: string
  atList: string[]
}[]
@Injectable()
export class AppService {
  boot: WechatyInterface
  logined = false
  scanLink = ''
  email: Email
  constructor() {
    this.init()
  }
  init() {
    this.email = new Email()
  }

  async login(force?: string): Promise<string> {
    return new Promise(res => {
      if (this.logined && !force) {
        res(JSON.stringify(this.boot.currentUser))
        return
      }
      this.boot = WechatyBuilder.build()
      this.boot
        .on('scan', qrcode => {
          const scanLink = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
          Logger.log(`Scan QR Code to login: ${scanLink}`)
          this.scanLink = scanLink
          res(scanLink)
        })
        .on('login', async user => {
          try {
            console.log(user, 'user')
            // const alias = await user?.alias()
            const logText = `User logged in`
            Logger.log(logText)
            this.notifyEmail(logText)
            this.logined = true
          } catch (err) {
            console.log('err', err)
          }
        })
        .on('logout', async () => {
          this.logined = false
          const logText = `boot logined is ${this.logined}`
          Logger.log(logText)
          this.notifyEmail(logText)
          // this.boot.stop()
        })
        .on('error', err => {
          console.log(err)
        })
      this.boot.start()
    })
  }

  async getBot() {
    if (this.boot && this.logined) {
      return JSON.stringify(this.boot.currentUser)
    } else {
      const link = await this.login()
      return link
    }
  }

  async sendMsg(user: string, msg: string) {
    try {
      const contact = await this.boot.Contact.find({ name: user })
      await contact?.say(msg)
      Logger.log(`success send msg to ${user}`)
    } catch (err) {
      console.log(`send msg ${err}`)
    }
  }
  async sendRoomMsg(list: RoomList = []) {
    try {
      for (const r of list) {
        const room = await this.boot.Room.find({ topic: r.titleList[0] })
        console.log(r.atList)
        const contacts = await this.getContacts(r.atList || [])
        await room?.say(r.receivedContent, ...contacts)

        Logger.log(`success send msg to ${r.titleList[0]}`)
      }
    } catch (err) {
      console.log(`send msg ${err}`)
    }
  }

  async getContacts(names: string[] = []): Promise<ContactInterface[]> {
    const contacts = []
    for (const n of names) {
      const c = await this.boot.Contact.find({ name: n })
      if (c) {
        contacts.push(c)
      }
    }
    return contacts
  }

  async notifyEmail(message) {
    this.email.send({
      email: process.env.NOTIFYEMAIL,
      text: message,
    })
  }
}
