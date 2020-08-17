'use strict';
const API_KEY_WEATHER = "<YOUR_KEY>";
const TOKEN_BOT = "<YOUR_TOKEN_BOT>";
const axios = require('axios')
const moment = require('moment')

const icons = {
  i01d: "☀️",
  i01n: "🌑",
  i02d: "🌤",
  i02n: "🌤",
  i03d: "🌥",
  i03n: "🌥",
  i04d: "☁️",
  i04n: "☁️",
  i09d: "🌧",
  i09n: "🌧",
  i10d: "🌦",
  i10n: "🌦",
  i11d: "⛈",
  i11n: "⛈",
  i13d: "❄️",
  i13n: "❄️",
  i50d: "🌫",
  i50n: "🌫"
}


module.exports.getWeather = async event => {
  let message;
  try {
    const body = JSON.parse(event.body);
    const { chat, text } = body.message;
    if (text.includes("now")) {
      const { data } = await axios.post(`https://api.openweathermap.org/data/2.5/weather?q=Cordoba,AR&appid=${API_KEY_WEATHER}&units=metric&lang=es`)
      message = `${icons["i" + data.weather[0].icon]} ${data.main.temp} °C - ${data.weather[0].description}`
    } else if (text.includes("tomorrow")) {
      let arr_min = [];
      let arr_max = [];
      let arr_icons = [];

      const { data } = await axios.post(`https://api.openweathermap.org/data/2.5/forecast?q=Cordoba,AR&appid=${API_KEY_WEATHER}&units=metric&lang=es`)

      data.list.map(element => {
        if (element.dt_txt.includes(moment().add(1, 'days').format("YYYY-MM-DD"))) {
          arr_min.push(Number(element.main.temp_min))
          arr_max.push(Number(element.main.temp_max))
          arr_icons.push(element.weather[0].icon)
        }
      });

      message = `${icons["i" + arr_icons[4]]} MIN ${Math.min(...arr_min)} °C - MAX ${Math.max(...arr_max)} °C`

    } else {
      message = "Command not found"
    }
    await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
      chat_id: chat.id,
      text: message
    })
  } catch (error) {
    message = error
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "OK"
      },
      null,
      2
    ),
  };
};
