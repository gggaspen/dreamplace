/**
 * Typography Atom Components
 * 
 * Semantic typography components based on design tokens
 * for consistent text rendering across the application.
 */

import { forwardRef } from 'react';
import { Text as ChakraText, Heading as ChakraHeading, TextProps, HeadingProps } from '@chakra-ui/react';
import { typographyScale, responsiveTypography } from '@/design-system/tokens/typography';

// Display Text Component (Hero sections, large headlines)
export interface DisplayProps extends Omit<HeadingProps, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsive?: boolean;
}

export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ size = 'lg', responsive = false, ...props }, ref) => {
    const styles = responsive && size === 'lg' 
      ? {
          fontSize: { base: '4xl', md: '6xl', lg: '7xl' },
          lineHeight: { base: 'tight', md: 'none' }
        }
      : typographyScale.display[size];

    return (
      <ChakraHeading
        ref={ref}
        as="h1"
        fontFamily="display"
        {...styles}
        {...props}
      />
    );
  }
);

// Heading Component (Section headers, card titles)
export interface CustomHeadingProps extends Omit<HeadingProps, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = forwardRef<HTMLHeadingElement, CustomHeadingProps>(
  ({ size = 'md', level = 2, ...props }, ref) => {
    const headingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    
    return (
      <ChakraHeading
        ref={ref}
        as={headingTag}
        {...typographyScale.heading[size]}
        {...props}
      />
    );
  }
);

// Body Text Component
export interface BodyProps extends Omit<TextProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'subtle';
}

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
  ({ size = 'md', variant = 'default', ...props }, ref) => {
    const colorMap = {
      default: 'fg.default',
      muted: 'fg.muted',
      subtle: 'fg.subtle'
    };

    return (
      <ChakraText
        ref={ref}
        color={colorMap[variant]}
        {...typographyScale.body[size]}
        {...props}
      />
    );
  }
);

// Label Component (Form labels, UI labels)
export interface LabelProps extends Omit<TextProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size = 'md', required = false, children, ...props }, ref) => {
    return (
      <ChakraText
        ref={ref}
        as="label"
        color="fg.default"
        {...typographyScale.label[size]}
        {...props}
      >
        {children}
        {required && (
          <ChakraText as="span" color="red.500" ml={1}>
            *
          </ChakraText>
        )}
      </ChakraText>
    );
  }
);

// Code Component (Inline code, code blocks)
export interface CodeProps extends Omit<TextProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ size = 'md', block = false, ...props }, ref) => {
    return (
      <ChakraText
        ref={ref}
        as={block ? 'pre' : 'code'}
        bg={block ? 'bg.subtle' : 'bg.muted'}
        px={block ? 4 : 1}
        py={block ? 2 : 0.5}
        borderRadius="sm"
        {...typographyScale.code[size]}
        {...props}
      />
    );
  }
);

// Caption Component (Small descriptive text)
export interface CaptionProps extends TextProps {
  variant?: 'default' | 'muted' | 'subtle';
}

export const Caption = forwardRef<HTMLParagraphElement, CaptionProps>(
  ({ variant = 'muted', ...props }, ref) => {
    const colorMap = {
      default: 'fg.default',
      muted: 'fg.muted',
      subtle: 'fg.subtle'
    };

    return (
      <ChakraText
        ref={ref}
        fontSize="xs"
        color={colorMap[variant]}
        lineHeight="normal"
        {...props}
      />
    );
  }
);

Display.displayName = 'Display';
Heading.displayName = 'Heading';
Body.displayName = 'Body';
Label.displayName = 'Label';
Code.displayName = 'Code';
Caption.displayName = 'Caption';