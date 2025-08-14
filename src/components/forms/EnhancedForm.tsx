/**
 * Enhanced Form Component
 * 
 * Advanced form component that combines BaseForm with persistence,
 * auto-save functionality, and additional features.
 */

import React, { useEffect, ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';
import { ZodSchema } from 'zod';
import {
  Box,
  HStack,
  Text,
  Icon,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { BaseForm, useFormContext } from './BaseForm';
import { useFormPersistence } from './hooks/useFormPersistence';
import { useAutoSave, AutoSaveStatus } from './hooks/useAutoSave';

// Enhanced form props
interface EnhancedFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (errors: any) => void;
  children: ReactNode;
  
  // Form options
  submitButtonText?: string;
  showResetButton?: boolean;
  disabled?: boolean;
  className?: string;
  
  // Persistence options
  persistenceKey?: string;
  enablePersistence?: boolean;
  persistenceOptions?: {
    excludeFields?: string[];
    encryptData?: boolean;
    expiryMinutes?: number;
  };
  
  // Auto-save options
  enableAutoSave?: boolean;
  autoSaveEndpoint?: string;
  onAutoSave?: (data: T) => Promise<void> | void;
  autoSaveOptions?: {
    debounceMs?: number;
    saveOnBlur?: boolean;
    excludeFields?: (keyof T)[];
  };
  
  // Display options
  showAutoSaveStatus?: boolean;
  showPersistenceIndicator?: boolean;
}

// Auto-save status indicator
function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const successColor = useColorModeValue('green.500', 'green.400');
  const errorColor = useColorModeValue('red.500', 'red.400');

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Spinner,
          text: 'Saving...',
          color: iconColor,
        };
      case 'saved':
        return {
          icon: FiCheck,
          text: 'Saved',
          color: successColor,
        };
      case 'error':
        return {
          icon: FiAlertCircle,
          text: 'Save failed',
          color: errorColor,
        };
      default:
        return {
          icon: FiSave,
          text: 'Auto-save enabled',
          color: iconColor,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <HStack spacing={2} fontSize="sm" color={config.color}>
      <Icon as={config.icon} />
      <Text>{config.text}</Text>
    </HStack>
  );
}

// Form content with hooks
function FormContent<T extends FieldValues>({
  children,
  persistenceKey,
  enablePersistence = false,
  persistenceOptions = {},
  enableAutoSave = false,
  onAutoSave,
  autoSaveOptions = {},
  showAutoSaveStatus = true,
}: {
  children: ReactNode;
  persistenceKey?: string;
  enablePersistence: boolean;
  persistenceOptions: any;
  enableAutoSave: boolean;
  onAutoSave?: (data: T) => Promise<void> | void;
  autoSaveOptions: any;
  showAutoSaveStatus: boolean;
}) {
  const { watch, reset } = useFormContext<T>();

  // Setup form persistence
  const persistence = useFormPersistence<T>({
    key: persistenceKey || 'form',
    ...persistenceOptions,
  });

  // Setup auto-save
  const autoSave = useAutoSave<T>({
    onSave: onAutoSave || (() => {}),
    enabled: enableAutoSave && !!onAutoSave,
    ...autoSaveOptions,
  });

  // Restore form data on mount
  useEffect(() => {
    if (enablePersistence) {
      persistence.restoreForm(reset);
    }
  }, [enablePersistence, persistence, reset]);

  // Setup watchers
  useEffect(() => {
    const subscriptions: (() => void)[] = [];

    if (enablePersistence) {
      const persistenceSubscription = persistence.watchAndSave(watch);
      subscriptions.push(persistenceSubscription.unsubscribe);
    }

    if (enableAutoSave && onAutoSave) {
      const autoSaveSubscription = autoSave.watchAndAutoSave(watch);
      if (autoSaveSubscription) {
        subscriptions.push(autoSaveSubscription.unsubscribe);
      }
    }

    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [enablePersistence, enableAutoSave, watch, persistence, autoSave, onAutoSave]);

  return (
    <Box>
      {children}
      
      {/* Auto-save status indicator */}
      {showAutoSaveStatus && enableAutoSave && onAutoSave && (
        <Box mt={4} textAlign="right">
          <AutoSaveIndicator status={autoSave.status} />
        </Box>
      )}
    </Box>
  );
}

export function EnhancedForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  children,
  submitButtonText,
  showResetButton,
  disabled,
  className,
  persistenceKey,
  enablePersistence = false,
  persistenceOptions = {},
  enableAutoSave = false,
  onAutoSave,
  autoSaveOptions = {},
  showAutoSaveStatus = true,
}: EnhancedFormProps<T>) {
  return (
    <BaseForm
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onError={onError}
      submitButtonText={submitButtonText}
      showResetButton={showResetButton}
      disabled={disabled}
      className={className}
    >
      <FormContent<T>
        persistenceKey={persistenceKey}
        enablePersistence={enablePersistence}
        persistenceOptions={persistenceOptions}
        enableAutoSave={enableAutoSave}
        onAutoSave={onAutoSave}
        autoSaveOptions={autoSaveOptions}
        showAutoSaveStatus={showAutoSaveStatus}
      >
        {children}
      </FormContent>
    </BaseForm>
  );
}