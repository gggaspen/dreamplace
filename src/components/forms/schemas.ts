/**
 * Zod Validation Schemas
 * 
 * Comprehensive validation schemas for various form types
 * using Zod for runtime type validation and type inference.
 */

import { z } from 'zod';

// Common validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// Common field schemas
export const commonSchemas = {
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(patterns.email, 'Invalid email format'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      patterns.password,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(patterns.phone, 'Invalid phone number format'),
  
  url: z
    .string()
    .regex(patterns.url, 'Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  required: z.string().min(1, 'This field is required'),
  
  optional: z.string().optional(),
  
  number: z
    .number()
    .min(0, 'Must be a positive number'),
  
  positiveNumber: z
    .number()
    .positive('Must be a positive number'),
};

// Contact form schema
export const contactFormSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone.optional().or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// User registration schema
export const userRegistrationSchema = z.object({
  firstName: commonSchemas.name,
  lastName: commonSchemas.name,
  email: commonSchemas.email,
  password: commonSchemas.password,
  confirmPassword: z.string(),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      },
      'You must be at least 18 years old'
    ),
  phone: commonSchemas.phone.optional().or(z.literal('')),
  newsletter: z.boolean().optional(),
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

// Login form schema
export const loginFormSchema = z.object({
  email: commonSchemas.email,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Event booking schema
export const eventBookingSchema = z.object({
  eventId: z.string().min(1, 'Event selection is required'),
  ticketType: z.enum(['general', 'vip', 'early-bird'], {
    errorMap: () => ({ message: 'Please select a ticket type' }),
  }),
  quantity: z
    .number()
    .min(1, 'At least 1 ticket is required')
    .max(10, 'Maximum 10 tickets per booking'),
  firstName: commonSchemas.name,
  lastName: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone,
  specialRequests: z
    .string()
    .max(500, 'Special requests must be less than 500 characters')
    .optional(),
  emergencyContact: z.object({
    name: commonSchemas.name,
    phone: commonSchemas.phone,
    relationship: z.string().min(1, 'Relationship is required'),
  }),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
});

export type EventBookingData = z.infer<typeof eventBookingSchema>;

// Artist submission schema
export const artistSubmissionSchema = z.object({
  artistName: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
  realName: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone,
  website: commonSchemas.url,
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    soundcloud: z.string().optional(),
    spotify: z.string().optional(),
  }),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  experience: z.enum(['beginner', 'intermediate', 'professional'], {
    errorMap: () => ({ message: 'Please select your experience level' }),
  }),
  equipment: z.object({
    hasOwnEquipment: z.boolean(),
    equipmentList: z.string().optional(),
  }),
  bio: z
    .string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must be less than 1000 characters'),
  availability: z.array(z.string()).min(1, 'Please select your availability'),
  references: z.array(z.object({
    venue: z.string().min(1, 'Venue name is required'),
    contact: z.string().min(1, 'Contact information is required'),
    date: z.string().min(1, 'Date is required'),
  })).optional(),
  portfolioLinks: z.array(z.string()).max(5, 'Maximum 5 portfolio links'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
});

export type ArtistSubmissionData = z.infer<typeof artistSubmissionSchema>;

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: commonSchemas.email,
  preferences: z.object({
    events: z.boolean().optional(),
    artists: z.boolean().optional(),
    promotions: z.boolean().optional(),
  }),
  frequency: z.enum(['daily', 'weekly', 'monthly'], {
    errorMap: () => ({ message: 'Please select a frequency' }),
  }).optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: commonSchemas.name,
  lastName: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone.optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: commonSchemas.url,
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }),
  notifications: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
  }),
  privacy: z.object({
    profileVisible: z.boolean().optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
  }),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: commonSchemas.password,
  confirmNewPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "New password must be different from current password",
    path: ['newPassword'],
  }
);

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// Search form schema
export const searchFormSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.enum(['all', 'events', 'artists', 'venues'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }).optional(),
  location: z.string().optional(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

// Generic dynamic form schema creator
export const createDynamicFormSchema = (fields: Array<{
  name: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url';
  required?: boolean;
  min?: number;
  max?: number;
}>) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach(field => {
    let schema: z.ZodTypeAny;
    
    switch (field.type) {
      case 'email':
        schema = commonSchemas.email;
        break;
      case 'phone':
        schema = commonSchemas.phone;
        break;
      case 'url':
        schema = commonSchemas.url;
        break;
      case 'number':
        schema = z.number();
        if (field.min !== undefined) schema = schema.min(field.min);
        if (field.max !== undefined) schema = schema.max(field.max);
        break;
      case 'boolean':
        schema = z.boolean();
        break;
      default:
        schema = z.string();
        if (field.min !== undefined) schema = schema.min(field.min);
        if (field.max !== undefined) schema = schema.max(field.max);
    }
    
    if (!field.required) {
      schema = schema.optional();
    }
    
    schemaObject[field.name] = schema;
  });
  
  return z.object(schemaObject);
};

// Form schema validator helper
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};