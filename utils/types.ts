import * as z from 'zod';

export type PostType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  message: string;
  likes: number;
  comments: number;
  developer: DeveloperType;
};

export type DeveloperType = {
    name?: string;
    email: string;
    id?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export const createAndEditPostSchema = z.object({
  message: z.string().min(2, {
    message: 'message must be at least 2 characters.',
  })
});

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const profileSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Must have at least 1 character' })
    .email({
      message: 'Must be a valid email',
    }),
  password: z
    .string()
    .min(8, { message: 'Must have at least 8 character' })
    .regex(passwordValidation, {
      message: 'Your password is not valid',
    }),
  confirmPassword: z.string().min(8, { message: 'Must have at least 8 character' }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

export const developerLoginSchema = z.object({
  email: z.string().min(2, {
    message: 'message must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'message must be at least 2 characters.',
  })
});

export type CreateAndEditPostType = z.infer<typeof createAndEditPostSchema>;
export type profileType = z.infer<typeof profileSchema>;
