/**
 * Dynamic Form Builder Component
 * 
 * A flexible form builder that generates forms from configuration objects.
 * Supports various field types, validation, conditional logic, and custom layouts.
 */

import React, { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { z } from 'zod';
import {
  VStack,
  HStack,
  Grid,
  GridItem,
  Divider,
  Heading,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { BaseForm } from './BaseForm';
import {
  InputField,
  TextareaField,
  SelectField,
  NumberField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
} from './FormField';
import { createDynamicFormSchema } from './schemas';

// Field types
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'url' 
  | 'tel' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'switch' 
  | 'radio'
  | 'divider'
  | 'heading'
  | 'text-block';

// Conditional logic
export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
}

// Field configuration
export interface FieldConfig {
  id: string;
  type: FieldType;
  name?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  
  // Field-specific props
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  direction?: 'row' | 'column';
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Layout props
  gridColumn?: string;
  gridRow?: string;
  width?: string | number;
  
  // Validation
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  
  // Conditional logic
  showIf?: ConditionalLogic[];
  
  // Content for non-input fields
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Section configuration
export interface SectionConfig {
  id: string;
  title?: string;
  description?: string;
  layout: 'stack' | 'grid';
  columns?: number;
  fields: FieldConfig[];
}

// Form configuration
export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  sections: SectionConfig[];
  submitButtonText?: string;
  showResetButton?: boolean;
}

// Props for DynamicFormBuilder
interface DynamicFormBuilderProps {
  config: FormConfig;
  onSubmit: (data: FieldValues) => Promise<void> | void;
  onError?: (errors: any) => void;
  defaultValues?: FieldValues;
  disabled?: boolean;
  className?: string;
}

export function DynamicFormBuilder({
  config,
  onSubmit,
  onError,
  defaultValues = {},
  disabled = false,
  className,
}: DynamicFormBuilderProps) {
  // Generate Zod schema from config
  const schema = useMemo(() => {
    const schemaFields: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url';
      required?: boolean;
      min?: number;
      max?: number;
    }> = [];

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (!field.name || ['divider', 'heading', 'text-block'].includes(field.type)) {
          return;
        }

        let fieldType: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url' = 'string';
        
        switch (field.type) {
          case 'email':
            fieldType = 'email';
            break;
          case 'tel':
            fieldType = 'phone';
            break;
          case 'url':
            fieldType = 'url';
            break;
          case 'number':
            fieldType = 'number';
            break;
          case 'checkbox':
          case 'switch':
            fieldType = 'boolean';
            break;
          default:
            fieldType = 'string';
        }

        schemaFields.push({
          name: field.name,
          type: fieldType,
          required: field.isRequired,
          min: field.validation?.minLength || field.min,
          max: field.validation?.maxLength || field.max,
        });
      });
    });

    return createDynamicFormSchema(schemaFields);
  }, [config]);

  // Check conditional logic
  const checkCondition = (condition: ConditionalLogic, formData: FieldValues): boolean => {
    const fieldValue = formData[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return String(fieldValue || '').includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'is_empty':
        return !fieldValue || fieldValue === '';
      case 'is_not_empty':
        return !!fieldValue && fieldValue !== '';
      default:
        return true;
    }
  };

  // Check if field should be shown
  const shouldShowField = (field: FieldConfig, formData: FieldValues): boolean => {
    if (!field.showIf || field.showIf.length === 0) {
      return true;
    }
    
    return field.showIf.every(condition => checkCondition(condition, formData));
  };

  // Render individual field
  const renderField = (field: FieldConfig, formData: FieldValues) => {
    if (!shouldShowField(field, formData)) {
      return null;
    }

    const commonProps = {
      name: field.name as any,
      label: field.label,
      helperText: field.helperText,
      isRequired: field.isRequired,
      isDisabled: field.isDisabled || disabled,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
        return (
          <InputField
            key={field.id}
            {...commonProps}
            type={field.type}
            size={field.size}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            key={field.id}
            {...commonProps}
            rows={field.rows}
          />
        );

      case 'select':
        return (
          <SelectField
            key={field.id}
            {...commonProps}
            options={field.options || []}
          />
        );

      case 'number':
        return (
          <NumberField
            key={field.id}
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            precision={field.precision}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={field.id}
            name={field.name as any}
            helperText={field.helperText}
            isDisabled={field.isDisabled || disabled}
            colorScheme={field.colorScheme}
          >
            {field.label}
          </CheckboxField>
        );

      case 'switch':
        return (
          <SwitchField
            key={field.id}
            {...commonProps}
            colorScheme={field.colorScheme}
            size={field.size}
          />
        );

      case 'radio':
        return (
          <RadioGroupField
            key={field.id}
            {...commonProps}
            options={field.options || []}
            direction={field.direction}
            colorScheme={field.colorScheme}
          />
        );

      case 'divider':
        return <Divider key={field.id} />;

      case 'heading':
        return (
          <Heading key={field.id} size={`h${field.level || 3}`}>
            {field.content}
          </Heading>
        );

      case 'text-block':
        return (
          <Text key={field.id} color="gray.600">
            {field.content}
          </Text>
        );

      default:
        return null;
    }
  };

  // Render section
  const renderSection = (section: SectionConfig, formData: FieldValues) => {
    const visibleFields = section.fields.filter(field => shouldShowField(field, formData));
    
    if (visibleFields.length === 0) {
      return null;
    }

    const sectionContent = section.layout === 'grid' ? (
      <Grid templateColumns={`repeat(${section.columns || 2}, 1fr)`} gap={6}>
        {section.fields.map(field => (
          <GridItem
            key={field.id}
            gridColumn={field.gridColumn}
            gridRow={field.gridRow}
            width={field.width}
          >
            {renderField(field, formData)}
          </GridItem>
        ))}
      </Grid>
    ) : (
      <VStack spacing={4} align="stretch">
        {section.fields.map(field => renderField(field, formData))}
      </VStack>
    );

    return (
      <Box key={section.id}>
        {section.title && (
          <Heading size="md" mb={2}>
            {section.title}
          </Heading>
        )}
        {section.description && (
          <Text color="gray.600" mb={4}>
            {section.description}
          </Text>
        )}
        {sectionContent}
      </Box>
    );
  };

  return (
    <BaseForm
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onError={onError}
      submitButtonText={config.submitButtonText}
      showResetButton={config.showResetButton}
      disabled={disabled}
      className={className}
    >
      {({ watch }) => {
        const formData = watch();
        
        return (
          <VStack spacing={8} align="stretch">
            {config.title && (
              <Heading size="lg">{config.title}</Heading>
            )}
            {config.description && (
              <Text color="gray.600">{config.description}</Text>
            )}
            
            {config.sections.map(section => renderSection(section, formData))}
          </VStack>
        );
      }}
    </BaseForm>
  );
}

// Helper function to create field configurations
export const createField = (config: Partial<FieldConfig> & { id: string; type: FieldType }): FieldConfig => ({
  ...config,
  name: config.name || config.id,
});

// Helper function to create section configurations
export const createSection = (config: Partial<SectionConfig> & { id: string; fields: FieldConfig[] }): SectionConfig => ({
  layout: 'stack',
  ...config,
});

// Helper function to create form configurations
export const createFormConfig = (config: Partial<FormConfig> & { id: string; sections: SectionConfig[] }): FormConfig => ({
  submitButtonText: 'Submit',
  showResetButton: true,
  ...config,
});

// Predefined field templates
export const fieldTemplates = {
  name: (id: string): FieldConfig => createField({
    id,
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    isRequired: true,
    validation: { minLength: 2, maxLength: 50 },
  }),
  
  email: (id: string): FieldConfig => createField({
    id,
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    isRequired: true,
  }),
  
  phone: (id: string): FieldConfig => createField({
    id,
    type: 'tel',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
  }),
  
  message: (id: string): FieldConfig => createField({
    id,
    type: 'textarea',
    label: 'Message',
    placeholder: 'Enter your message',
    isRequired: true,
    rows: 4,
    validation: { minLength: 10, maxLength: 1000 },
  }),
};