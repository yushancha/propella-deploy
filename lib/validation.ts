import { z } from 'zod';
import { t } from './i18n';

/**
 * Common validation rules
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
 * Item generation request validation
 */
export const generateItemSchema = z.object({
  prompt: commonValidation.prompt,
  style: commonValidation.style,
  userId: z.string().optional(),
});

/**
 * User registration validation
 */
export const registerSchema = z.object({
  email: commonValidation.email,
  password: commonValidation.password,
  name: commonValidation.name,
});

/**
 * Generic request validation function
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
