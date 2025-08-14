/**
 * Base Form Component with React Hook Form and Zod Integration
 *
 * Enhanced form component that provides type-safe form handling with
 * React Hook Form for performance and Zod for runtime validation.
 */

import React, { ReactNode } from 'react';
import {
  useForm,
  FieldValues,
  Path,
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
  UseFormReset,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Box, VStack, HStack, Button, useToast } from '@chakra-ui/react';

// Form context interface
export interface FormContextValue<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  reset: UseFormReset<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form context
export const FormContext = React.createContext<FormContextValue<any> | null>(null);

// Hook to use form context
export const useFormContext = <T extends FieldValues>(): FormContextValue<T> => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a BaseForm component');
  }
  return context as FormContextValue<T>;
};

// Base form props
interface BaseFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (errors: FieldErrors<T>) => void;
  children: ReactNode;
  submitButtonText?: string;
  showResetButton?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
}

export function BaseForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  children,
  submitButtonText = 'Submit',
  showResetButton = true,
  disabled = false,
  className,
  autoComplete = 'on',
  noValidate = true,
}: BaseFormProps<T>) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    control,
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFormError = (fieldErrors: FieldErrors<T>) => {
    onError?.(fieldErrors);
    toast({
      title: 'Validation Error',
      description: 'Please correct the errors in the form',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const formContextValue: FormContextValue<T> = {
    register,
    errors,
    control,
    watch,
    setValue,
    getValues,
    reset,
    isSubmitting,
    isValid,
    isDirty,
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <Box
        as='form'
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        className={className}
        autoComplete={autoComplete}
        noValidate={noValidate}
      >
        <VStack spacing={6} align='stretch'>
          {children}

          <HStack spacing={4} justify='flex-end'>
            {showResetButton && (
              <Button
                type='button'
                variant='outline'
                onClick={() => reset()}
                disabled={disabled || isSubmitting || !isDirty}
              >
                Reset
              </Button>
            )}
            <Button
              type='submit'
              colorScheme='blue'
              isLoading={isSubmitting}
              disabled={disabled || !isValid}
              loadingText='Submitting...'
            >
              {submitButtonText}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </FormContext.Provider>
  );
}
