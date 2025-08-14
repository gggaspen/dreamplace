/**
 * Form Field Components with React Hook Form Integration
 *
 * Reusable form field components that integrate with React Hook Form
 * and provide consistent styling and validation feedback.
 */

import React from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { NumberInput } from '@/components/ui/number-input';
import { Radio } from '@/components/ui/radio';
import {
  Input,
  Textarea,
  Select,
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      required={isRequired}
      disabled={isDisabled}
    >
      <InputGroup size={size}>
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <Input {...register(name)} type={type} placeholder={placeholder} />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
    </Field>
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      required={isRequired}
      disabled={isDisabled}
    >
      <Textarea {...register(name)} placeholder={placeholder} rows={rows} resize={resize} />
    </Field>
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      required={isRequired}
      disabled={isDisabled}
    >
      <Select {...register(name)} placeholder={placeholder}>
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      required={isRequired}
      disabled={isDisabled}
    >
      <NumberInput.Root
        value={String(value || '')}
        onValueChange={({ valueAsNumber }) => setValue(name, valueAsNumber as any)}
        min={min}
        max={max}
        step={step}
        formatOptions={{ maximumFractionDigits: precision }}
      >
        <NumberInput.Field {...register(name)} placeholder={placeholder} />
        {showStepper && <NumberInput.Control />}
      </NumberInput.Root>
    </Field>
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
    <Field
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      disabled={isDisabled}
    >
      <Checkbox {...register(name)}>
        {children}
      </Checkbox>
    </Field>
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      disabled={isDisabled}
    >
      <Switch {...register(name)} size={size} />
    </Field>
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
    <Field
      label={label}
      invalid={!!error}
      errorText={error?.message}
      helperText={!error ? helperText : undefined}
      required={isRequired}
      disabled={isDisabled}
    >
      <Radio.Root
        value={value}
        onValueChange={val => setValue(name, val as any)}
      >
        <Stack direction={direction}>
          {options.map(option => (
            <Radio.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              {...register(name)}
            >
              <Radio.ItemControl />
              <Radio.ItemText>{option.label}</Radio.ItemText>
            </Radio.Item>
          ))}
        </Stack>
      </Radio.Root>
    </Field>
  );
}
