/**
 * Card Atom Component
 * 
 * A flexible container component for grouping related content
 * with consistent styling and interactive states.
 */

import { forwardRef } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { componentShadows } from '@/design-system/tokens/shadows';
import { componentSpacing } from '@/design-system/tokens/spacing';

export interface CardProps extends BoxProps {
  /**
   * Card variant affecting visual style
   */
  variant?: 'elevated' | 'outlined' | 'filled' | 'ghost';
  
  /**
   * Card size affecting padding and spacing
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the card is interactive (hover effects)
   */
  interactive?: boolean;
  
  /**
   * Whether the card is currently selected/active
   */
  selected?: boolean;
}

const cardStyles = {
  base: {
    borderRadius: 'lg',
    transition: 'all 200ms ease',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  
  variants: {
    elevated: {
      bg: 'bg.default',
      boxShadow: 'shadow.default',
      border: '1px solid',
      borderColor: 'transparent'
    },
    outlined: {
      bg: 'bg.default',
      border: '1px solid',
      borderColor: 'border.default',
      boxShadow: 'none'
    },
    filled: {
      bg: 'bg.subtle',
      border: '1px solid',
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    ghost: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'transparent',
      boxShadow: 'none'
    }
  },
  
  sizes: {
    sm: {
      p: componentSpacing.card.padding.small
    },
    md: {
      p: componentSpacing.card.padding.medium
    },
    lg: {
      p: componentSpacing.card.padding.large
    }
  },
  
  interactive: {
    cursor: 'pointer',
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: 'shadow.medium'
    },
    _active: {
      transform: 'translateY(0)',
      boxShadow: 'shadow.default'
    }
  },
  
  selected: {
    borderColor: 'brand.500',
    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
  }
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'elevated', 
    size = 'md', 
    interactive = false, 
    selected = false, 
    children, 
    ...props 
  }, ref) => {
    return (
      <Box
        ref={ref}
        {...cardStyles.base}
        {...cardStyles.variants[variant]}
        {...cardStyles.sizes[size]}
        {...(interactive ? cardStyles.interactive : {})}
        {...(selected ? cardStyles.selected : {})}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';