import { Injectable } from '@nestjs/common'
import { WechatyBuilder } from 'wechaty'
import { ContactInterface, WechatyInterface } from 'wechaty/impls'
export type RoomList = {
  "titleList": string[],
  "receivedContent": string,
  "atList":  string[]
}[]
@Injectable()
export class AppService {
  boot: WechatyInterface
  logined = false
  scanLink = ''
  constructor() {
    this.init()
  }
  init () {
    const wechaty = WechatyBuilder.build()
    wechaty
      .on('scan', (qrcode, status) => {
        const scanLink = `${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
        console.log(`Scan QR Code to login: ${scanLink}`)
        this.scanLink = scanLink
      })
      .on('login',            user => console.log(`User ${user} logged in`))
      .on('message',       message => console.log(`Message: ${message}`))
    wechaty.start()
    this.boot = wechaty
  }

  getHello(): string {
    return 'Hello World!';
  }

  getBot () {
    if (this.boot) {
      return this.boot
    } else {
      return this.scanLink
    }
  }

  async sendMsg (user: string, msg: string) {
    try {
      const contact = await this.boot.Contact.find({name: user})
      const res = await contact?.say(msg)
      console.log(res)
    } catch(err) {
      console.log(`send msg ${err}`)
    }
  }
  async sendRoomMsg (list: RoomList) {
    try {
      for (let r of list) {
        const room = await this.boot.Room.find({topic: r.titleList[0]})
        const contacts = await this.getContacts(r.atList)
        const res = await room?.say(r.receivedContent, ...contacts)

        console.log(res)
      }
      
    } catch(err) {
      console.log(`send msg ${err}`)
    }
  }
  
  async getContacts (names: string[]): Promise<ContactInterface[]> {
    let contacts = []
    for (let n of names) {
      const c = await this.boot.Contact.find({ name: n })
      if (c) {
        contacts.push(c)
      }
    }
    return contacts
  }
}
