import Router from "koa-router"
import { cacheMiddleware } from "src/middlewares/cache"
import { z } from "zod"
import { userController } from "../controllers/user.controller"
import { authenticate, authorize, requireOwnerOrAdmin } from "../middlewares/auth"
import { validateBody, validateParams } from "../middlewares/validate"

const router = new Router()

// 验证 Schema
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["admin", "user", "guest"]).optional(),
})

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "user", "guest"]).optional(),
  avatar_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
})

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
})

// 路由定义
router.get("/", cacheMiddleware(60), authenticate, authorize("admin"), userController.getAll)
router.get("/search", authenticate, userController.search)
router.get("/stats", authenticate, authorize("admin"), userController.getStats)

router.get("/:id", cacheMiddleware(300), authenticate, validateParams(idParamsSchema), userController.getById)

router.post("/", authenticate, authorize("admin"), validateBody(createUserSchema), userController.create)

router.patch(
  "/:id",
  authenticate,
  validateParams(idParamsSchema),
  requireOwnerOrAdmin,
  validateBody(updateUserSchema),
  userController.update
)

router.delete("/:id", authenticate, validateParams(idParamsSchema), authorize("admin"), userController.delete)

router.post(
  "/:id/change-password",
  authenticate,
  validateParams(idParamsSchema),
  requireOwnerOrAdmin,
  validateBody(changePasswordSchema),
  userController.changePassword
)

export { router as userRouter }
