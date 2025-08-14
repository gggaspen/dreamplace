/**
 * Form Field Components with React Hook Form Integration
 * 
 * Reusable form field components that integrate with React Hook Form
 * and provide consistent styling and validation feedback.
 */

import React from 'react';
import { FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { useFormContext } from './BaseForm';

// Base field props
interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

// Input field props
interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function InputField<T extends FieldValues>({
  name,
  label,
  helperText,
  isRequired,
  isDisabled,
  placeholder,
  type = 'text',
  leftElement,
  rightElement,
  size = 'md',
}: InputFieldProps<T>) {
  const { register, errors } = useFormContext<T>();
  const error = errors[name];

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup size={size}>
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <Input
          {...register(name)}
          type={type}
          placeholder={placeholder}
        />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Textarea field props
interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  helperText,
  isRequired,
  isDisabled,
  placeholder,
  rows = 4,
  resize = 'vertical',
}: TextareaFieldProps<T>) {
  const { register, errors } = useFormContext<T>();
  const error = errors[name];

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        resize={resize}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Select field props
interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  helperText,
  isRequired,
  isDisabled,
  options,
  placeholder,
}: SelectFieldProps<T>) {
  const { register, errors } = useFormContext<T>();
  const error = errors[name];

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select {...register(name)} placeholder={placeholder}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Number input field props
interface NumberFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showStepper?: boolean;
}

export function NumberField<T extends FieldValues>({
  name,
  label,
  helperText,
  isRequired,
  isDisabled,
  placeholder,
  min,
  max,
  step,
  precision,
  showStepper = true,
}: NumberFieldProps<T>) {
  const { register, errors, setValue, watch } = useFormContext<T>();
  const error = errors[name];
  const value = watch(name) as number;

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <NumberInput
        value={value || ''}
        onChange={(_, valueAsNumber) => setValue(name, valueAsNumber as any)}
        min={min}
        max={max}
        step={step}
        precision={precision}
      >
        <NumberInputField
          {...register(name)}
          placeholder={placeholder}
        />
        {showStepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </NumberInput>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Checkbox field props
interface CheckboxFieldProps<T extends FieldValues> extends Omit<BaseFieldProps<T>, 'label'> {
  children: React.ReactNode;
  colorScheme?: string;
}

export function CheckboxField<T extends FieldValues>({
  name,
  helperText,
  isDisabled,
  children,
  colorScheme = 'blue',
}: CheckboxFieldProps<T>) {
  const { register, errors } = useFormContext<T>();
  const error = errors[name];

  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <Checkbox
        {...register(name)}
        colorScheme={colorScheme}
      >
        {children}
      </Checkbox>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Switch field props
interface SwitchFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SwitchField<T extends FieldValues>({
  name,
  label,
  helperText,
  isDisabled,
  colorScheme = 'blue',
  size = 'md',
}: SwitchFieldProps<T>) {
  const { register, errors } = useFormContext<T>();
  const error = errors[name];

  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <Stack direction="row" align="center" justify="space-between">
        {label && <FormLabel mb="0">{label}</FormLabel>}
        <Switch
          {...register(name)}
          colorScheme={colorScheme}
          size={size}
        />
      </Stack>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

// Radio group field props
interface RadioGroupFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  direction?: 'row' | 'column';
  colorScheme?: string;
}

export function RadioGroupField<T extends FieldValues>({
  name,
  label,
  helperText,
  isRequired,
  isDisabled,
  options,
  direction = 'column',
  colorScheme = 'blue',
}: RadioGroupFieldProps<T>) {
  const { register, errors, setValue, watch } = useFormContext<T>();
  const error = errors[name];
  const value = watch(name) as string;

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        value={value}
        onChange={(val) => setValue(name, val as any)}
        colorScheme={colorScheme}
      >
        <Stack direction={direction}>
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              isDisabled={option.disabled}
              {...register(name)}
            >
              {option.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}