import z from "zod";

const EMAIL_MAX_LENGTH = 256;
const PASSWORD_MAX_LENGTH = 256;
const PASSWORD_MIN_LENGTH = 8;

const lowercaseRegex = /^(?=.*[a-z])/;
const uppercaseRegex = /^(?=.*[A-Z])/;
const numberRegex = /^(?=.*[0-9])/;
const symbolRegex = /^(?=.*[!@#$%^&*()_+={}|[\]\\:';"<>?,./])/;

// base email schema to be used in any email field
export const emailBaseSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .max(
      EMAIL_MAX_LENGTH,
      `Email should not exceed ${EMAIL_MAX_LENGTH} characters`
    )
    .email("Please enter a valid email address"),
});

// base password schema to be used in any password field
export const passwordBaseSchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(
      PASSWORD_MIN_LENGTH,
      `Password should at least be ${PASSWORD_MIN_LENGTH} characters long`
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password should not exceed ${PASSWORD_MAX_LENGTH} characters long`
    ),
});

// refined password schemata to show every password verfication
const refinedPasswordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(
    PASSWORD_MIN_LENGTH,
    `Password should be at least ${PASSWORD_MIN_LENGTH} characters long`
  )
  .refine(
    (value) => lowercaseRegex.test(value),
    "Password should contain at least one lowercase letter"
  )
  .refine(
    (value) => uppercaseRegex.test(value),
    "Password should contain at least one uppercase letter"
  )
  .refine(
    (value) => numberRegex.test(value),
    "Password should contain at least one number"
  )
  .refine(
    (value) => symbolRegex.test(value),
    "Password should contain at least one symbol"
  );

export const passwordSchema = z.object({
  password: refinedPasswordSchema,
});

// Login Schema
export const loginSchema = z.object({
  ...emailBaseSchema.shape,
  password: z
    .string({
      required_error: "Password is required",
    })
});

// Signup Schema
export const registerSchema = z.object({
  name: z.string({
    required_error: "Name is required"
  }),
  ...emailBaseSchema.shape,
  ...passwordBaseSchema.shape,
});

// reset Password Schema
export const resetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  })
});

// new password schema
export const newPasswordSchema = z.object({
  ...passwordBaseSchema.shape,
  confirmPassword: z.string({
    required_error: "Confirm password is required",
  }),
})
.superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The passwords did not match",
      path: ["confirmPassword"],
    });
  }
})
