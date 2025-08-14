/**
 * Dynamic Form Example
 * 
 * Example implementation of a dynamic form created using the form builder
 * with conditional logic and various field types.
 */

import React from 'react';
import {
  DynamicFormBuilder,
  createFormConfig,
  createSection,
  createField,
  fieldTemplates,
  FormConfig,
} from '../index';

interface DynamicFormExampleProps {
  onSubmit?: (data: any) => Promise<void>;
}

export function DynamicFormExample({ onSubmit }: DynamicFormExampleProps) {
  // Create form configuration
  const formConfig: FormConfig = createFormConfig({
    id: 'survey-form',
    title: 'Customer Survey',
    description: 'Help us improve our services by providing your feedback.',
    submitButtonText: 'Submit Survey',
    sections: [
      // Personal Information Section
      createSection({
        id: 'personal-info',
        title: 'Personal Information',
        description: 'Tell us a bit about yourself',
        layout: 'grid',
        columns: 2,
        fields: [
          fieldTemplates.name('firstName'),
          fieldTemplates.email('email'),
          createField({
            id: 'age',
            type: 'select',
            label: 'Age Group',
            isRequired: true,
            options: [
              { value: '18-24', label: '18-24' },
              { value: '25-34', label: '25-34' },
              { value: '35-44', label: '35-44' },
              { value: '45-54', label: '45-54' },
              { value: '55+', label: '55+' },
            ],
          }),
          createField({
            id: 'location',
            type: 'text',
            label: 'City',
            placeholder: 'Enter your city',
          }),
        ],
      }),

      // Experience Section
      createSection({
        id: 'experience',
        title: 'Your Experience',
        layout: 'stack',
        fields: [
          createField({
            id: 'visited-before',
            type: 'radio',
            label: 'Have you attended our events before?',
            isRequired: true,
            options: [
              { value: 'yes', label: 'Yes, multiple times' },
              { value: 'once', label: 'Yes, once' },
              { value: 'no', label: 'No, this is my first time' },
            ],
          }),
          
          // Conditional field - only show if visited before
          createField({
            id: 'favorite-event',
            type: 'text',
            label: 'What was your favorite event?',
            placeholder: 'Tell us about your favorite event',
            showIf: [
              { field: 'visited-before', operator: 'not_equals', value: 'no' }
            ],
          }),
          
          createField({
            id: 'rating',
            type: 'radio',
            label: 'How would you rate our events overall?',
            isRequired: true,
            direction: 'row',
            options: [
              { value: '5', label: 'Excellent' },
              { value: '4', label: 'Good' },
              { value: '3', label: 'Average' },
              { value: '2', label: 'Poor' },
              { value: '1', label: 'Very Poor' },
            ],
          }),
        ],
      }),

      // Feedback Section
      createSection({
        id: 'feedback',
        title: 'Feedback & Suggestions',
        layout: 'stack',
        fields: [
          createField({
            id: 'improvements',
            type: 'textarea',
            label: 'What improvements would you like to see?',
            placeholder: 'Share your suggestions for improvements...',
            rows: 4,
          }),
          
          createField({
            id: 'recommend',
            type: 'switch',
            label: 'Would you recommend us to friends?',
          }),
          
          createField({
            id: 'newsletter',
            type: 'checkbox',
            name: 'newsletter',
            helperText: 'Stay updated with our latest events and news',
          }),
          
          createField({
            id: 'contact-permission',
            type: 'checkbox',
            name: 'contact-permission',
            helperText: 'We may contact you for follow-up questions about this survey',
          }),
        ],
      }),
    ],
  });

  const defaultValues = {
    firstName: '',
    email: '',
    age: '',
    location: '',
    'visited-before': '',
    'favorite-event': '',
    rating: '',
    improvements: '',
    recommend: false,
    newsletter: false,
    'contact-permission': false,
  };

  const handleSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Survey submitted:', data);
    }
  };

  return (
    <DynamicFormBuilder
      config={formConfig}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  );
}