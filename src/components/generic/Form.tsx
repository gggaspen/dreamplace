/**
 * Generic Form Components with TypeScript Generics
 * 
 * Type-safe form components that provide full TypeScript support
 * for form data, validation, and submission handling.
 */

import React, { ReactNode } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Switch,
  Checkbox,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';

// Generic field value types
export type FieldValue = string | number | boolean | Date | null | undefined;

// Generic form data interface
export interface FormData {
  [key: string]: FieldValue;
}

// Field configuration interface
export interface FieldConfig<T extends FormData> {
  name: keyof T;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'date';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string }>; // For select fields
  validate?: (value: T[keyof T]) => string | null;
  render?: (field: FieldRenderProps<T>) => ReactNode; // Custom render function
}

// Field render props
interface FieldRenderProps<T extends FormData> {
  field: FieldConfig<T>;
  value: T[keyof T];
  error: string | null;
  onChange: (value: T[keyof T]) => void;
  onBlur: () => void;
}

// Form validation errors
export type FormErrors<T extends FormData> = {
  [K in keyof T]?: string;
};

// Generic form props
interface FormProps<T extends FormData> {
  fields: FieldConfig<T>[];
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => FormErrors<T>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  resetOnSubmit?: boolean;
  children?: (props: FormRenderProps<T>) => ReactNode;
}

// Form render props
interface FormRenderProps<T extends FormData> {
  values: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (name: keyof T, value: T[keyof T]) => void;
  handleSubmit: () => void;
  reset: () => void;
}

export function Form<T extends FormData>({
  fields,
  initialValues,
  onSubmit,
  validate,
  submitButtonText = 'Submit',
  isSubmitting = false,
  disabled = false,
  resetOnSubmit = false,
  children,
}: FormProps<T>): React.ReactElement {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<FormErrors<T>>({});
  const [touched, setTouched] = React.useState<Set<keyof T>>(new Set());

  // Handle field value changes
  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle field blur
  const handleBlur = (name: keyof T) => {
    setTouched(prev => new Set(prev).add(name));
    
    // Validate field on blur
    const field = fields.find(f => f.name === name);
    if (field?.validate) {
      const error = field.validate(values[name]);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  };

  // Validate all fields
  const validateAll = (): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};

    // Run field-level validation
    fields.forEach(field => {
      if (field.validate) {
        const error = field.validate(values[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }

      // Check required fields
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${String(field.name)} is required`;
      }
    });

    // Run form-level validation
    if (validate) {
      const formErrors = validate(values);
      Object.assign(newErrors, formErrors);
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(values);
        if (resetOnSubmit) {
          setValues(initialValues);
          setTouched(new Set());
          setErrors({});
        }
      } catch (error) {
        // Handle submission errors
        console.error('Form submission error:', error);
      }
    }
  };

  // Reset form
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
  };

  const isValid = Object.keys(errors).length === 0;

  // Render field component
  const renderField = (field: FieldConfig<T>) => {
    const value = values[field.name];
    const error = touched.has(field.name) ? errors[field.name] : null;

    if (field.render) {
      return field.render({
        field,
        value,
        error: error || null,
        onChange: (newValue) => handleChange(field.name, newValue),
        onBlur: () => handleBlur(field.name),
      });
    }

    return (
      <FormControl
        key={String(field.name)}
        isInvalid={!!error}
        isRequired={field.required}
        isDisabled={field.disabled || disabled}
      >
        {field.label && <FormLabel>{field.label}</FormLabel>}
        
        {field.type === 'textarea' && (
          <Textarea
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
            onBlur={() => handleBlur(field.name)}
          />
        )}

        {field.type === 'select' && field.options && (
          <Select
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
            onBlur={() => handleBlur(field.name)}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}

        {field.type === 'checkbox' && (
          <Checkbox
            isChecked={Boolean(value)}
            onChange={(e) => handleChange(field.name, e.target.checked as T[keyof T])}
            onBlur={() => handleBlur(field.name)}
          >
            {field.label}
          </Checkbox>
        )}

        {field.type === 'switch' && (
          <Switch
            isChecked={Boolean(value)}
            onChange={(e) => handleChange(field.name, e.target.checked as T[keyof T])}
            onBlur={() => handleBlur(field.name)}
          />
        )}

        {!['textarea', 'select', 'checkbox', 'switch'].includes(field.type) && (
          <Input
            type={field.type}
            value={String(value || '')}
            placeholder={field.placeholder}
            onChange={(e) => {
              const newValue = field.type === 'number' ? Number(e.target.value) : e.target.value;
              handleChange(field.name, newValue as T[keyof T]);
            }}
            onBlur={() => handleBlur(field.name)}
          />
        )}

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        {field.helperText && !error && (
          <FormHelperText>{field.helperText}</FormHelperText>
        )}
      </FormControl>
    );
  };

  // If children render prop is provided, use that
  if (children) {
    return (
      <>
        {children({
          values,
          errors,
          isSubmitting,
          isValid,
          handleChange,
          handleSubmit,
          reset,
        })}
      </>
    );
  }

  // Default form layout
  return (
    <VStack spacing={4} align="stretch">
      {fields.map(renderField)}
      
      <HStack spacing={4} justify="flex-end">
        <Button variant="outline" onClick={reset} disabled={disabled || isSubmitting}>
          Reset
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={disabled || !isValid}
        >
          {submitButtonText}
        </Button>
      </HStack>
    </VStack>
  );
}

// Helper function to create type-safe field configurations
export const createField = <T extends FormData>(field: FieldConfig<T>): FieldConfig<T> => field;

export const createFields = <T extends FormData>(fields: FieldConfig<T>[]): FieldConfig<T>[] => fields;