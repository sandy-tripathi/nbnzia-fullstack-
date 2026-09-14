const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const projectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(600),
  href: z.string().trim().url('href must be a valid URL'),
  imageUrl: z.string().trim().min(1, 'imageUrl is required'),
  bg: z.string().trim().optional(),
  textDark: z.boolean().optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

const projectUpdateSchema = projectSchema.partial();

const serviceSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(400),
  imageUrl: z.string().trim().min(1, 'imageUrl is required'),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

const serviceUpdateSchema = serviceSchema.partial();

const contactStatusSchema = z.object({
  status: z.enum(['unread', 'read', 'replied', 'archived']),
});

/**
 * Express middleware factory: validates req.body against a zod schema.
 * On success, replaces req.body with the parsed (typed/trimmed) data.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  contactSchema,
  loginSchema,
  projectSchema,
  projectUpdateSchema,
  serviceSchema,
  serviceUpdateSchema,
  contactStatusSchema,
  validateBody,
};
