import Router from "koa-router"
import { z } from "zod"
import { authController } from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth"
import { validateBody } from "../middlewares/validate"

const router = new Router()

// 验证 Schema
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
})

// 公开路由
router.post("/register", validateBody(registerSchema), authController.register)
router.post("/login", validateBody(loginSchema), authController.login)
router.post("/refresh", validateBody(refreshTokenSchema), authController.refreshToken)
router.post("/logout", validateBody(refreshTokenSchema), authController.logout)

// 需要认证的路由
router.get("/me", authenticate, authController.me)
router.post("/logout-all", authenticate, authController.logoutAll)
router.get("/sessions", authenticate, authController.getSessions)

export { router as authRouter }
