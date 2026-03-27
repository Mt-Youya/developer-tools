import Router from "@koa/router"
import { WeatherController } from "../controllers/weather.controller"
import { cacheMiddleware } from "../middlewares/cache"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const weatherController = new WeatherController()

export const weatherRouter = new Router()

const gameRateLimit = rateLimitMiddleware(300)

weatherRouter.get("/getWeather", weatherController.getWeather)
