# Wechat Bot

## Description

simple nestjs server for send msg to contact or room by wechaty

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## api

| path      | argument |
| ----------- | ----------- |
| /send      | {user: string; msg: string}       |
| /sendRoom   | {list: RoomList}  RoomList: {
  "titleList": string[],
  "receivedContent": string,
  "atList": string[]
}[]      |

## License

Nest is [MIT licensed](LICENSE).
