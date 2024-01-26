import { Logger } from '@nestjs/common'
import * as nodemail from 'nodemailer'

export class Email {
  transporter: nodemail
  user: string
  constructor() {
    this.user = process.env.EMAILUSER
    this.transporter = nodemail.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: this.user,
        pass: process.env.EMAILCODE,
      },
    })
  }

  send({ email, subject = 'wechat', text, html = '' }) {
    const options = {
      from: `163<${this.user}>`,
      to: email,
      subject,
      text,
      html,
    }
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        Logger.log('邮件发送失败')
        Logger.log(error)
      } else {
        Logger.log('邮件发送成功')
        // console.log(info)
      }
    })
  }
}
