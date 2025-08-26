import { z } from 'zod';
import { t } from './i18n';

/**
 * 通用验证规则
 */
export const commonValidation = {
  email: z.string().email(t('validation.email')),
  password: z.string().min(6, t('validation.passwordLength')).max(50, t('validation.passwordMax')),
  name: z.string().min(1, t('validation.nameRequired')).max(50, t('validation.nameMax')),
  prompt: z.string().min(1, t('validation.promptRequired')).max(500, t('validation.promptMax')),
  style: z.enum(["pixel", "cyberpunk", "fantasy", "scifi", "cartoon"], {
    errorMap: () => ({ message: t('validation.styleInvalid') })
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
    return { success: false, errors: { general: t('validation.genericFailure') } };
  }
}
