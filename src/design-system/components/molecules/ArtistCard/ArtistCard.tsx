/**
 * ArtistCard Molecule Component
 * 
 * A specialized card component for displaying artist information
 * including photo, name, genre, and social links.
 */

import { forwardRef } from 'react';
import { Box, Image, VStack, HStack, IconButton, Link } from '@chakra-ui/react';
import { Card } from '../../atoms/Card';
import { Heading, Body, Caption } from '../../atoms/Typography';
import { FaInstagram, FaSoundcloud, FaSpotify, FaGlobe } from 'react-icons/fa';

export interface ArtistCardProps {
  /**
   * Artist data
   */
  artist: {
    id: string;
    name: string;
    genre?: string;
    photo?: string;
    bio?: string;
    socialLinks?: {
      website?: string;
      instagram?: string;
      soundcloud?: string;
      spotify?: string;
    };
    featured?: boolean;
  };
  
  /**
   * Card size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Layout orientation
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Show social links
   */
  showSocialLinks?: boolean;
  
  /**
   * Event handlers
   */
  onArtistClick?: (artistId: string) => void;
}

const sizeStyles = {
  sm: {
    imageSize: '80px',
    padding: 'sm' as const
  },
  md: {
    imageSize: '120px',
    padding: 'md' as const
  },
  lg: {
    imageSize: '160px',
    padding: 'lg' as const
  }
};

const socialIcons = {
  website: FaGlobe,
  instagram: FaInstagram,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify
};

export const ArtistCard = forwardRef<HTMLDivElement, ArtistCardProps>(
  ({ 
    artist, 
    size = 'md', 
    orientation = 'vertical',
    showSocialLinks = true,
    onArtistClick,
    ...props 
  }, ref) => {
    const styles = sizeStyles[size];
    
    const handleCardClick = () => {
      onArtistClick?.(artist.id);
    };

    const socialLinksArray = artist.socialLinks 
      ? Object.entries(artist.socialLinks).filter(([_, url]) => url)
      : [];

    const CardContent = (
      <>
        {/* Artist Photo */}
        <Box
          position="relative"
          flexShrink={0}
          width={orientation === 'horizontal' ? styles.imageSize : 'full'}
          height={styles.imageSize}
        >
          {artist.photo ? (
            <Image
              src={artist.photo}
              alt={artist.name}
              objectFit="cover"
              w="full"
              h="full"
              borderRadius={orientation === 'vertical' ? 'full' : 'md'}
              loading="lazy"
            />
          ) : (
            <Box
              w="full"
              h="full"
              bg="bg.subtle"
              borderRadius={orientation === 'vertical' ? 'full' : 'md'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="fg.muted"
              fontSize="2xl"
            >
              🎧
            </Box>
          )}
          
          {/* Featured Badge */}
          {artist.featured && (
            <Box
              position="absolute"
              top={-1}
              right={-1}
              bg="brand.500"
              color="white"
              borderRadius="full"
              w="6"
              h="6"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
            >
              ⭐
            </Box>
          )}
        </Box>
        
        {/* Artist Info */}
        <VStack 
          spacing={2} 
          align={orientation === 'vertical' ? 'center' : 'start'}
          textAlign={orientation === 'vertical' ? 'center' : 'left'}
          flex={1}
        >
          <VStack spacing={1} align={orientation === 'vertical' ? 'center' : 'start'}>
            <Heading 
              size={size === 'lg' ? 'lg' : 'md'} 
              lineHeight="shorter"
            >
              {artist.name}
            </Heading>
            
            {artist.genre && (
              <Caption variant="muted" fontSize="sm">
                {artist.genre}
              </Caption>
            )}
          </VStack>
          
          {artist.bio && orientation === 'vertical' && (
            <Body 
              size="sm" 
              variant="muted" 
              noOfLines={2}
              textAlign="center"
            >
              {artist.bio}
            </Body>
          )}
          
          {/* Social Links */}
          {showSocialLinks && socialLinksArray.length > 0 && (
            <HStack spacing={2} pt={1}>
              {socialLinksArray.map(([platform, url]) => {
                const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                
                return (
                  <Link
                    key={platform}
                    href={url}
                    isExternal
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      aria-label={`${artist.name} on ${platform}`}
                      icon={<IconComponent />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      _hover={{
                        color: 'brand.500',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </Link>
                );
              })}
            </HStack>
          )}
        </VStack>
      </>
    );

    return (
      <Card
        ref={ref}
        variant="elevated"
        size={styles.padding}
        interactive={!!onArtistClick}
        onClick={handleCardClick}
        maxW={orientation === 'vertical' ? 'xs' : 'md'}
        {...props}
      >
        {orientation === 'vertical' ? (
          <VStack spacing={4} align="center">
            {CardContent}
          </VStack>
        ) : (
          <HStack spacing={4} align="start">
            {CardContent}
          </HStack>
        )}
      </Card>
    );
  }
);

ArtistCard.displayName = 'ArtistCard';