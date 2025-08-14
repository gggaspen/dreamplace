/**
 * Contact Form Example
 * 
 * Example implementation of a contact form using the enhanced form system
 * with validation, persistence, and auto-save functionality.
 */

import React from 'react';
import { VStack, useToast } from '@chakra-ui/react';
import {
  EnhancedForm,
  InputField,
  TextareaField,
  CheckboxField,
  contactFormSchema,
  ContactFormData,
} from '../index';

interface ContactFormExampleProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  enableAutoSave?: boolean;
  enablePersistence?: boolean;
}

export function ContactFormExample({
  onSubmit,
  enableAutoSave = false,
  enablePersistence = true,
}: ContactFormExampleProps) {
  const toast = useToast();

  const defaultValues: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    terms: false,
  };

  const handleSubmit = async (data: ContactFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Contact form submitted:', data);
    }
  };

  const handleAutoSave = async (data: ContactFormData) => {
    // Simulate auto-save API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved contact form:', data);
  };

  return (
    <EnhancedForm
      schema={contactFormSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitButtonText="Send Message"
      enablePersistence={enablePersistence}
      persistenceKey="contact-form"
      persistenceOptions={{
        excludeFields: ['terms'],
        expiryMinutes: 60,
      }}
      enableAutoSave={enableAutoSave}
      onAutoSave={handleAutoSave}
      autoSaveOptions={{
        debounceMs: 2000,
        excludeFields: ['terms'],
        saveOnBlur: true,
      }}
      showAutoSaveStatus={enableAutoSave}
    >
      <VStack spacing={6} align="stretch">
        <InputField
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          isRequired
        />
        
        <InputField
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          isRequired
        />
        
        <InputField
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number (optional)"
        />
        
        <InputField
          name="subject"
          label="Subject"
          placeholder="What is this message about?"
          isRequired
        />
        
        <TextareaField
          name="message"
          label="Message"
          placeholder="Tell us more about your inquiry..."
          rows={6}
          isRequired
        />
        
        <CheckboxField name="terms" isRequired>
          I agree to the terms and conditions and privacy policy
        </CheckboxField>
      </VStack>
    </EnhancedForm>
  );
}