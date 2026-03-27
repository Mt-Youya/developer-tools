export interface Rain {
  txt: string
}
export interface Now {
  cond_code: number // 天气状况代码
  cond_txt: string // 天气状况描述
  hum: string // 相对湿度，百分比数值
  pcpn: string // 降水量，单位毫米
  pres: string // 大气压强，单位百帕
  tmp: number // 温度，单位摄氏度
  wind_dir: string // 风向
  wind_sc: string // 风力
}

export interface AirNowCity {
  qlty: string // 空气质量等级
  aqi: string // 空气质量指数
}

export interface Sun {
  rise: string // 日出时间
  set: string // 日落时间
}

export interface WeatherResponse {
  status: string // 状态
  rain: Rain // 雨
  now: Now // 当前天气
  air_now_city: AirNowCity // 空气城市
  sun: Sun // 太阳
  daily_forecast: DailyForecast[] // 天气预报
}

export interface DailyForecast {
  date: string // 日期
  cond_txt_d: string // 天气状况描述
  cond_code_d: number // 天气状况代码
  wind_sc: string // 风力
  tmp_max: string // 最高温度
  tmp_min: string // 最低温度
}

export interface WeatherParams {
  location: string
  lang?: "cn" | "en"
  type?: "city" | "ip"
}
