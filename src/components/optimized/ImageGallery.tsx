/**
 * Optimized Image Gallery Component
 * 
 * High-performance image gallery with lazy loading, virtualization,
 * and progressive image loading for large image sets.
 */

import React, { useState, useMemo } from 'react';
import { Box, Grid, Modal, ModalOverlay, ModalContent, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { LazyImage } from './LazyImage';

interface ImageItem {
  id: string | number;
  src: string;
  alt: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: ImageItem[];
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number };
  gap?: number;
  aspectRatio?: string;
  clickable?: boolean;
  lazyLoad?: boolean;
  quality?: number;
  sizes?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({
  images,
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  aspectRatio = '1',
  clickable = true,
  lazyLoad = true,
  quality = 75,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Memoize grid template columns for performance
  const gridTemplateColumns = useMemo(() => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }

    return {
      base: columns.base ? `repeat(${columns.base}, 1fr)` : '1fr',
      sm: columns.sm ? `repeat(${columns.sm}, 1fr)` : undefined,
      md: columns.md ? `repeat(${columns.md}, 1fr)` : undefined,
      lg: columns.lg ? `repeat(${columns.lg}, 1fr)` : undefined,
    };
  }, [columns]);

  // Handle image click
  const handleImageClick = (image: ImageItem) => {
    if (!clickable) return;
    
    setSelectedImage(image);
    onOpen();
  };

  // Handle modal close
  const handleModalClose = () => {
    onClose();
    // Delay clearing selected image to allow for smooth transition
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <>
      <Grid
        templateColumns={gridTemplateColumns}
        gap={gap}
        w="full"
      >
        {images.map((image, index) => (
          <Box
            key={image.id}
            position="relative"
            aspectRatio={aspectRatio}
            overflow="hidden"
            borderRadius="md"
            cursor={clickable ? 'pointer' : 'default'}
            transition="transform 0.2s ease"
            _hover={clickable ? { transform: 'scale(1.05)' } : undefined}
            onClick={() => handleImageClick(image)}
          >
            <LazyImage
              src={image.thumbnail || image.src}
              alt={image.alt}
              fill
              priority={index < 4} // Prioritize first 4 images
              quality={quality}
              sizes={sizes}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Grid>

      {/* Modal for full-size image viewing */}
      {selectedImage && (
        <Modal isOpen={isOpen} onClose={handleModalClose} size="6xl" isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
            <ModalCloseButton
              position="fixed"
              top={4}
              right={4}
              zIndex="modal"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: 'blackAlpha.800' }}
            />
            <Box
              position="relative"
              w="full"
              h="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LazyImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width || 1200}
                height={selectedImage.height || 800}
                priority
                quality={90}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </ModalContent>
        </Modal>
      )}
    </>
  );
});