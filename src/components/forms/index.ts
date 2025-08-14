/**
 * Forms Module Exports
 * 
 * Centralized exports for all form-related components, hooks, and utilities.
 */

// Core form components
export { BaseForm, useFormContext } from './BaseForm';
export { EnhancedForm } from './EnhancedForm';
export { DynamicFormBuilder, createField, createSection, createFormConfig, fieldTemplates } from './DynamicFormBuilder';

// Form field components
export {
  InputField,
  TextareaField,
  SelectField,
  NumberField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
} from './FormField';

// Validation schemas
export {
  commonSchemas,
  contactFormSchema,
  userRegistrationSchema,
  loginFormSchema,
  eventBookingSchema,
  artistSubmissionSchema,
  newsletterSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  searchFormSchema,
  createDynamicFormSchema,
  validateSchema,
} from './schemas';

// Type exports
export type {
  ContactFormData,
  UserRegistrationData,
  LoginFormData,
  EventBookingData,
  ArtistSubmissionData,
  NewsletterData,
  ProfileUpdateData,
  PasswordChangeData,
  SearchFormData,
} from './schemas';

export type {
  FieldType,
  FieldConfig,
  SectionConfig,
  FormConfig,
  ConditionalLogic,
} from './DynamicFormBuilder';

// Hooks
export { useFormPersistence } from './hooks/useFormPersistence';
export { useAutoSave } from './hooks/useAutoSave';
export type { AutoSaveStatus } from './hooks/useAutoSave';

// Re-export React Hook Form types for convenience
export type {
  FieldValues,
  FieldErrors,
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
  UseFormReset,
  Path,
} from 'react-hook-form';