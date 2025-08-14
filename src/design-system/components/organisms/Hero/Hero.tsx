/**
 * Hero Organism Component
 *
 * A compound component for hero sections with flexible content arrangement,
 * responsive design, and multiple layout variations.
 */

import { ReactNode } from 'react';
import { Box, Container, VStack, HStack, Image, BoxProps } from '@chakra-ui/react';
import { Display, Body } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

export interface HeroProps extends BoxProps {
  /**
   * Hero variant affecting layout and styling
   */
  variant?: 'default' | 'centered' | 'split' | 'minimal';

  /**
   * Background configuration
   */
  background?: {
    type: 'color' | 'gradient' | 'image' | 'video';
    value: string;
    overlay?: boolean;
    overlayOpacity?: number;
  };

  /**
   * Content configuration
   */
  content: {
    title: string;
    subtitle?: string;
    description?: string;
    primaryAction?: {
      label: string;
      onClick: () => void;
      variant?: 'brand' | 'secondary' | 'outline';
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
      variant?: 'brand' | 'secondary' | 'outline';
    };
  };

  /**
   * Media content (image, video, etc.)
   */
  media?: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    position?: 'left' | 'right';
  };

  /**
   * Custom content to render alongside or instead of default content
   */
  children?: ReactNode;

  /**
   * Height configuration
   */
  height?: 'auto' | 'screen' | 'large' | 'medium' | 'small';
}

const heightMap = {
  auto: 'auto',
  screen: '100vh',
  large: '80vh',
  medium: '60vh',
  small: '40vh',
};

const getBackgroundStyles = (background?: HeroProps['background']) => {
  if (!background) return {};

  const baseStyles: any = {
    position: 'relative',
    overflow: 'hidden',
  };

  switch (background.type) {
    case 'color':
      baseStyles.bg = background.value;
      break;
    case 'gradient':
      baseStyles.bgGradient = background.value;
      break;
    case 'image':
      baseStyles.bgImage = `url(${background.value})`;
      baseStyles.bgSize = 'cover';
      baseStyles.bgPosition = 'center';
      baseStyles.bgRepeat = 'no-repeat';
      break;
    case 'video':
      // Video background would be handled separately
      break;
  }

  return baseStyles;
};

const Overlay = ({ opacity = 0.5 }: { opacity?: number }) => (
  <Box
    position='absolute'
    top={0}
    left={0}
    right={0}
    bottom={0}
    bg='blackAlpha.500'
    opacity={opacity}
    zIndex={1}
  />
);

export const Hero: React.FC<HeroProps> = ({
  variant = 'default',
  background,
  content,
  media,
  children,
  height = 'large',
  ...props
}) => {
  const backgroundStyles = getBackgroundStyles(background);

  const ContentSection = (
    <VStack spacing={6} align='start' maxW='2xl' zIndex={2} position='relative'>
      <VStack spacing={4} align='start'>
        <Display
          size='xl'
          responsive
          color={background?.type === 'image' || background?.type === 'video' ? 'white' : 'inherit'}
        >
          {content.title}
        </Display>

        {content.subtitle && (
          <Display
            size='md'
            color={
              background?.type === 'image' || background?.type === 'video'
                ? 'whiteAlpha.800'
                : 'fg.muted'
            }
          >
            {content.subtitle}
          </Display>
        )}

        {content.description && (
          <Body
            size='lg'
            color={
              background?.type === 'image' || background?.type === 'video'
                ? 'whiteAlpha.900'
                : 'fg.default'
            }
            maxW='lg'
          >
            {content.description}
          </Body>
        )}
      </VStack>

      {/* Actions */}
      {(content.primaryAction || content.secondaryAction) && (
        <HStack spacing={4}>
          {content.primaryAction && (
            <Button
              size='lg'
              variant={content.primaryAction.variant || 'brand'}
              onClick={content.primaryAction.onClick}
            >
              {content.primaryAction.label}
            </Button>
          )}

          {content.secondaryAction && (
            <Button
              size='lg'
              variant={content.secondaryAction.variant || 'outline'}
              onClick={content.secondaryAction.onClick}
            >
              {content.secondaryAction.label}
            </Button>
          )}
        </HStack>
      )}
    </VStack>
  );

  const MediaSection = media && (
    <Box flexShrink={0} maxW={{ base: 'full', lg: '50%' }} zIndex={2} position='relative'>
      {media.type === 'image' ? (
        <Image
          src={media.src}
          alt={media.alt || ''}
          borderRadius='xl'
          shadow='2xl'
          maxH='500px'
          objectFit='cover'
        />
      ) : (
        <Box
          as='video'
          src={media.src}
          autoPlay
          muted
          loop
          borderRadius='xl'
          shadow='2xl'
          maxH='500px'
          w='full'
        />
      )}
    </Box>
  );

  const renderContent = () => {
    if (children) {
      return children;
    }

    switch (variant) {
      case 'centered':
        return (
          <VStack spacing={8} textAlign='center' alignItems='center'>
            {ContentSection}
            {MediaSection}
          </VStack>
        );

      case 'split':
        return (
          <HStack
            spacing={{ base: 8, lg: 16 }}
            align='center'
            direction={{ base: 'column', lg: media?.position === 'left' ? 'row-reverse' : 'row' }}
          >
            {ContentSection}
            {MediaSection}
          </HStack>
        );

      case 'minimal':
        return ContentSection;

      default:
        return (
          <VStack spacing={8} align='start'>
            {ContentSection}
            {MediaSection}
          </VStack>
        );
    }
  };

  return (
    <Box
      minH={heightMap[height]}
      display='flex'
      alignItems='center'
      py={{ base: 12, md: 20 }}
      {...backgroundStyles}
      {...props}
    >
      {background?.overlay && <Overlay opacity={background.overlayOpacity} />}

      <Container maxW='7xl' position='relative' zIndex={2}>
        {renderContent()}
      </Container>
    </Box>
  );
};
