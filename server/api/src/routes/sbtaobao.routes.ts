import Router from "@koa/router"
import { sbTaobaoController } from "../controllers/sbtaobao.controller"

const sbtbController = new sbTaobaoController()

export const sbtaobaoRouter = new Router()
sbtaobaoRouter.post("/caonima", sbtbController.cnmtaobao)
