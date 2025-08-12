import { z } from 'zod';

/**
 * 通用验证规则
 */
export const commonValidation = {
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6位").max(50, "密码最多50位"),
  name: z.string().min(1, "姓名不能为空").max(50, "姓名最多50位"),
  prompt: z.string().min(1, "提示词不能为空").max(500, "提示词最多500位"),
  style: z.enum(["pixel", "cyberpunk", "fantasy", "scifi", "cartoon"], {
    errorMap: () => ({ message: "请选择有效的风格" })
  }),
};

/**
 * 道具生成请求验证
 */
export const generateItemSchema = z.object({
  prompt: commonValidation.prompt,
  style: commonValidation.style,
  userId: z.string().optional(),
});

/**
 * 用户注册验证
 */
export const registerSchema = z.object({
  email: commonValidation.email,
  password: commonValidation.password,
  name: commonValidation.name,
});

/**
 * 通用请求验证函数
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
  errors?: never;
} | {
  success: false;
  data?: never;
  errors: Record<string, string>;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "验证失败" } };
  }
}
