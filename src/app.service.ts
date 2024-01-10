import { Injectable } from '@nestjs/common'
import { WechatyBuilder } from 'wechaty'
import { ContactInterface, WechatyInterface } from 'wechaty/impls'
import { Response } from 'express'

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
  constructor() {
    this.init()
  }
  init() {
    this.boot = WechatyBuilder.build()
    // this.boot
    //   .on('scan', (qrcode, status) => {
    //     const scanLink = `${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
    //     console.log(`Scan QR Code to login: ${scanLink}`)
    //     this.scanLink = scanLink
    //   })
    //   .on('login', user => console.log(`User ${user} logged in`))
    // .on('message', message => console.log(`Message: ${message}`))
    this.boot.start()
  }

  async login(force?: string): Promise<string> {
    return new Promise(res => {
      if (this.boot.isLoggedIn && !force) return res(JSON.stringify(this.boot.currentUser))
      this.boot
        .on('scan', (qrcode, status) => {
          const scanLink = `${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
          console.log(`Scan QR Code to login: ${scanLink}`)
          this.scanLink = scanLink
          res(scanLink)
        })
        .on('login', user => {
          console.log(`User ${user} logged in`)
          this.logined = true
        })
        .on('logout', () => {
          this.logined = false
        })
      this.boot.reset()
    })
  }

  async getBot(res: Response) {
    if (this.boot.isLoggedIn && this.logined) {
      res.send(JSON.stringify(this.boot.currentUser))
    } else {
      const link = await this.login()
      console.log(link)
      res.redirect(link.split('\n')[1])
    }
  }

  async sendMsg(user: string, msg: string) {
    try {
      const contact = await this.boot.Contact.find({ name: user })
      const res = await contact?.say(msg)
      console.log(res)
    } catch (err) {
      console.log(`send msg ${err}`)
    }
  }
  async sendRoomMsg(list: RoomList) {
    try {
      for (const r of list) {
        const room = await this.boot.Room.find({ topic: r.titleList[0] })
        const contacts = await this.getContacts(r.atList)
        const res = await room?.say(r.receivedContent, ...contacts)
        console.log(res)
      }
    } catch (err) {
      console.log(`send msg ${err}`)
    }
  }

  async getContacts(names: string[]): Promise<ContactInterface[]> {
    const contacts = []
    for (const n of names) {
      const c = await this.boot.Contact.find({ name: n })
      if (c) {
        contacts.push(c)
      }
    }
    return contacts
  }
}
