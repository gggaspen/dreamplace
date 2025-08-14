/**
 * Button Atom Component
 *
 * A foundational button component with consistent styling,
 * accessibility features, and brand-aligned design.
 */

import React, { forwardRef } from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { componentShadows } from '@/design-system/tokens/shadows';

export interface ButtonProps extends Omit<ChakraButtonProps, 'size' | 'variant'> {
  /**
   * Button size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Button variant
   */
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'brand' | 'secondary';

  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;

  /**
   * Icon to display on the left side of the button
   */
  leftIcon?: React.ReactElement;

  /**
   * Icon to display on the right side of the button
   */
  rightIcon?: React.ReactElement;
}

const buttonStyles = {
  baseStyle: {
    fontWeight: 'medium',
    borderRadius: 'md',
    transition: 'all 150ms ease',
    _focus: {
      boxShadow: componentShadows.button.focus,
      outline: 'none',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },

  sizes: {
    xs: {
      height: '6',
      minW: '6',
      fontSize: 'xs',
      px: '2',
    },
    sm: {
      height: '8',
      minW: '8',
      fontSize: 'sm',
      px: '3',
    },
    md: {
      height: '10',
      minW: '10',
      fontSize: 'md',
      px: '4',
    },
    lg: {
      height: '12',
      minW: '12',
      fontSize: 'lg',
      px: '6',
    },
    xl: {
      height: '14',
      minW: '14',
      fontSize: 'xl',
      px: '8',
    },
  },

  variants: {
    brand: {
      bg: 'brand.500',
      color: 'white',
      boxShadow: componentShadows.button.resting,
      _hover: {
        bg: 'brand.600',
        boxShadow: componentShadows.button.hover,
        transform: 'translateY(-1px)',
      },
      _active: {
        bg: 'brand.700',
        boxShadow: componentShadows.button.pressed,
        transform: 'translateY(0)',
      },
    },
    secondary: {
      bg: 'secondary.500',
      color: 'white',
      boxShadow: componentShadows.button.resting,
      _hover: {
        bg: 'secondary.600',
        boxShadow: componentShadows.button.hover,
        transform: 'translateY(-1px)',
      },
      _active: {
        bg: 'secondary.700',
        boxShadow: componentShadows.button.pressed,
        transform: 'translateY(0)',
      },
    },
  },
};

export const Button = React.memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'solid', size = 'md', loading, leftIcon, rightIcon, ...props }, ref) => {
      // Apply custom styles based on variant
      const customStyles =
        variant === 'brand' || variant === 'secondary' ? buttonStyles.variants[variant] : {};

      return (
        <ChakraButton
          ref={ref}
          size={size}
          variant={variant === 'brand' || variant === 'secondary' ? 'solid' : variant}
          isLoading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          {...buttonStyles.baseStyle}
          {...customStyles}
          {...props}
        >
          {children}
        </ChakraButton>
      );
    }
  )
);

Button.displayName = 'Button';
