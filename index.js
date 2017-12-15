const fs = require('fs')
const http = require('http')
const location = 'yamaguchi-ken,jp'
const units = 'metric'
const APIKEY = 'APIKEY_IS_HERE'
const URL = 'http://api.openweathermap.org/data/2.5/weather?q='+ location +'&units='+ units +'&appid='+ APIKEY
const Discord = require('discord.js')
const client = new Discord.Client()
const token = 'Discord_Token_here'
const yamaguchi = JSON.parse(fs.readFileSync('./yamaguchi_weather.json', 'utf8'))
const japanese = JSON.parse(fs.readFileSync('./japanese.json', 'utf8'))
const ja = japanese[yamaguchi.weather[0].id]
client.on('ready', () => {
  console.log('OK!')
})

client.on('message', message => {
  if (message.content === '!天気情報更新') {
    http.get(URL, res => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        body += chunk
      })
      res.on('data', () => {
        res = JSON.parse(body)
        fs.writeFile('yamaguchi_weather.json', JSON.stringify(res, null, '   '))
      })
    }).on('error', e => {
      console.log(e.message)
    })
  }
  if (message.content === '!山口県の天気') {
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: 'OpenWeat herMap',
        icon_url: 'https://raw.githubusercontent.com/danyweis/pics4codepen/master/weather/icon/openweathermap.png',
      },
      title: '盛岡市のお天気情報',
      url: 'https://openweathermap.org',
      description: 'OpenWeatherMapのAPI叩いたデータです。',
      fields: [{
        name: '今日の情報',
        value: '天気 :' + ja + '\n'
              + '気温: ' + yamaguchi.main.temp + '°C\n'
              + '風力: ' + yamaguchi.wind.speed + 'm\n'
              + '風向: ' + yamaguchi.wind.deg + '°\n'
              + '雲量: ' + yamaguchi.clouds.all + '%\n',
      }],
      timestamp: new Date(),
      footer: {
        icon_url: 'http://openweathermap.org/img/w/' + yamaguchi.weather[0].icon +'.png',
        text: 'This bot is corded by 3mdev. All rights reserved.',
      },
    }})
  }
})
client.login(token)
