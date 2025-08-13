/**
 * Modal Composition Components
 * 
 * Composable modal components that provide flexible modal structures.
 * Each component can be used independently to create custom modal layouts.
 */

import React, { ReactNode } from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalProps as ChakraModalProps,
  Button,
  Flex,
  Text,
  BoxProps
} from '@chakra-ui/react';

// Base modal wrapper
interface ModalProps extends Omit<ChakraModalProps, 'children'> {
  children: ReactNode;
  overlay?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  children, 
  overlay = true,
  ...props 
}) => {
  return (
    <ChakraModal {...props}>
      {overlay && <ModalOverlay />}
      <ModalContent>
        {children}
      </ModalContent>
    </ChakraModal>
  );
};

// Modal header component
interface ModalHeaderCompProps extends BoxProps {
  children: ReactNode;
  showCloseButton?: boolean;
}

export const ModalHeaderComp: React.FC<ModalHeaderCompProps> = ({ 
  children, 
  showCloseButton = true,
  ...props 
}) => {
  return (
    <ModalHeader {...props}>
      {children}
      {showCloseButton && <ModalCloseButton />}
    </ModalHeader>
  );
};

// Modal body component
interface ModalBodyCompProps extends BoxProps {
  children: ReactNode;
}

export const ModalBodyComp: React.FC<ModalBodyCompProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <ModalBody {...props}>
      {children}
    </ModalBody>
  );
};

// Modal footer component
interface ModalFooterCompProps extends BoxProps {
  children: ReactNode;
}

export const ModalFooterComp: React.FC<ModalFooterCompProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <ModalFooter {...props}>
      {children}
    </ModalFooter>
  );
};

// Modal actions component (preset action buttons)
interface ModalActionsProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: string;
  cancelVariant?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'solid',
  cancelVariant = 'ghost',
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Flex gap={3} justify="flex-end">
      {onCancel && (
        <Button
          variant={cancelVariant}
          onClick={onCancel}
          disabled={isLoading || disabled}
        >
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={disabled}
        >
          {confirmText}
        </Button>
      )}
    </Flex>
  );
};

// Modal title component
interface ModalTitleProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ 
  children, 
  level = 3 
}) => {
  const sizeMap = {
    1: 'xl',
    2: 'lg',
    3: 'md',
    4: 'sm',
    5: 'sm',
    6: 'xs'
  } as const;

  return (
    <Text
      as={`h${level}`}
      fontSize={sizeMap[level]}
      fontWeight="semibold"
      lineHeight="tight"
    >
      {children}
    </Text>
  );
};