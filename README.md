# pHack-bot

## Requirements
1. Discord Bot Token Guide [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. Node.js >= v12.0.0

## Installation
### Discord Bot
* Navigate to `discordbot/` folder and run `npm install`
* Copy `discordbot/config.example.json` to `discordbot/config.json` and configure it

### Backend
* Navigate to `discordbot/` folder and run `npm install`
* Copy `backend/.env.example` to `backend/.env` and configure it

Create .env file to project's root with following variables (user ids separated by space):
```
 TOKEN
 PREFIX
 MSGUSERS
 ADMINUSER
```

## Starting the bot
* docker-compose up -d
