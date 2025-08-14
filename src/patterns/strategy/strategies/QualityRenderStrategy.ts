import React from 'react';
import { BaseRenderStrategy } from '../BaseRenderStrategy';
import { RenderData, RenderContext, RenderResult, ContentType } from '../types';

/**
 * Quality Render Strategy - optimized for visual quality and rich interactions
 * Prioritizes visual appeal and smooth animations over performance
 */
export class QualityRenderStrategy extends BaseRenderStrategy {
  constructor() {
    super('quality', 'Optimized for visual quality and rich interactions');
  }

  canHandle(data: RenderData, context: RenderContext): boolean {
    // Can handle any content type
    return true;
  }

  getPriority(data: RenderData, context: RenderContext): number {
    let priority = 4; // Base priority

    // Higher priority for high-end devices
    if (context.performance.deviceClass === 'high') {
      priority += 6;
    }

    // Higher priority for desktop devices with larger screens
    if (context.viewport.deviceType === 'desktop') {
      priority += 4;
    }

    // Higher priority for fast connections
    if (context.performance.connectionSpeed === 'fast') {
      priority += 3;
    }

    // Higher priority for visual content types
    const contentType = this.detectContentType(data.content);
    if ([ContentType.IMAGE, ContentType.VIDEO, ContentType.CAROUSEL, ContentType.HERO].includes(contentType)) {
      priority += 2;
    }

    // Lower priority if reduced motion is preferred
    if (this.hasReducedMotion(context)) {
      priority -= 3;
    }

    // Lower priority for low-end devices
    if (this.isLowEndDevice(context)) {
      priority -= 5;
    }

    return Math.max(1, priority);
  }

  async render(data: RenderData, context: RenderContext): Promise<RenderResult> {
    const startTime = this.startPerformanceTracking();

    try {
      const element = await this.renderHighQuality(data, context);
      const renderTime = this.endPerformanceTracking(startTime);

      return this.createRenderResult(element, renderTime, {
        qualityFeatures: this.getAppliedQualityFeatures(data, context),
        renderMode: 'quality',
      });
    } catch (error) {
      this.log('Quality render failed', error);
      throw error;
    }
  }

  private async renderHighQuality(
    data: RenderData,
    context: RenderContext
  ): Promise<React.ReactElement> {
    const { content, props = {} } = data;
    const contentType = this.detectContentType(content);

    switch (contentType) {
      case ContentType.IMAGE:
        return this.renderHighQualityImage(content, props, context);
      
      case ContentType.CAROUSEL:
        return this.renderHighQualityCarousel(content, props, context);
      
      case ContentType.HERO:
        return this.renderHighQualityHero(content, props, context);
      
      case ContentType.CARD:
        return this.renderHighQualityCard(content, props, context);
      
      case ContentType.LIST:
        return this.renderHighQualityList(content, props, context);
      
      default:
        return this.renderHighQualityGeneric(content, props, context);
    }
  }

  private renderHighQualityImage(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const imageProps: any = {
      ...props,
      loading: 'eager', // Load high-quality images immediately
      decoding: 'sync',
      quality: 95, // High quality
    };

    // Add responsive images with multiple resolutions
    if (content.srcSet) {
      imageProps.srcSet = content.srcSet;
      imageProps.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw';
    }

    // Add smooth transitions and effects
    imageProps.style = {
      ...imageProps.style,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: content.filter || 'none',
      transform: 'scale(1)',
    };

    // Add hover effects for interactive images
    if (content.interactive) {
      imageProps.onMouseEnter = () => {
        // Add hover animation
      };
      imageProps.style.cursor = 'pointer';
    }

    // Add blur-to-sharp loading effect
    if (content.placeholder) {
      imageProps.style.background = `url(${content.placeholder}) no-repeat center/cover`;
    }

    return React.createElement('img', imageProps);
  }

  private renderHighQualityCarousel(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const items = Array.isArray(content.items) ? content.items : [];
    
    const carouselProps = {
      ...props,
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        ...props.style,
      },
    };

    // Create advanced carousel with smooth transitions
    const carouselContent = React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        },
      },
      items.map((item: any, index: number) =>
        React.createElement(
          'div',
          {
            key: index,
            style: {
              flex: '0 0 100%',
              padding: '2rem',
              background: `linear-gradient(135deg, ${this.generateGradient(index)})`,
              color: 'white',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
          React.createElement('h3', {
            style: {
              fontSize: '2rem',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }
          }, item.title || item.name),
          item.description && React.createElement('p', {
            style: {
              fontSize: '1.1rem',
              opacity: 0.9,
              maxWidth: '600px',
            }
          }, item.description)
        )
      )
    );

    // Add navigation dots
    const navigation = React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        },
      },
      items.map((_, index) =>
        React.createElement('button', {
          key: index,
          style: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: 'none',
            background: index === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          },
        })
      )
    );

    return React.createElement(
      'div',
      carouselProps,
      carouselContent,
      navigation
    );
  }

  private renderHighQualityHero(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const heroProps = {
      ...props,
      style: {
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${content.backgroundImage}) center/cover`,
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        ...props.style,
      },
    };

    // Add parallax background if supported
    if (content.parallax && !this.hasReducedMotion(context)) {
      heroProps.style.backgroundAttachment = 'fixed';
    }

    const heroContent = React.createElement(
      'div',
      {
        style: {
          maxWidth: '800px',
          padding: '2rem',
          animation: this.hasReducedMotion(context) ? 'none' : 'fadeInUp 1s ease-out',
        },
      },
      
      // Main title with beautiful typography
      content.title && React.createElement('h1', {
        style: {
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          marginBottom: '1.5rem',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
        }
      }, content.title),
      
      // Subtitle
      content.subtitle && React.createElement('p', {
        style: {
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          marginBottom: '2rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6',
        }
      }, content.subtitle),
      
      // CTA Button with premium styling
      content.cta && React.createElement('button', {
        style: {
          padding: '1rem 2.5rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          transform: 'translateY(0)',
        },
        onMouseEnter: (e) => {
          if (!this.hasReducedMotion(context)) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
          }
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        },
      }, content.cta.text || 'Learn More')
    );

    return React.createElement('section', heroProps, heroContent);
  }

  private renderHighQualityCard(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const cardProps = {
      ...props,
      style: {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: content.interactive ? 'pointer' : 'default',
        transform: 'translateY(0)',
        ...props.style,
      },
    };

    // Add hover effects
    if (content.interactive && !this.hasReducedMotion(context)) {
      cardProps.onMouseEnter = (e: any) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15), 0 20px 40px rgba(0, 0, 0, 0.1)';
      };
      cardProps.onMouseLeave = (e: any) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1)';
      };
    }

    const cardElements = [];

    // Image
    if (content.image) {
      cardElements.push(
        React.createElement('img', {
          key: 'image',
          src: content.image,
          alt: content.imageAlt || '',
          style: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          },
        })
      );
    }

    // Content
    cardElements.push(
      React.createElement(
        'div',
        {
          key: 'content',
          style: {
            padding: '1.5rem',
          },
        },
        
        content.title && React.createElement('h3', {
          style: {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#1a202c',
          }
        }, content.title),
        
        content.description && React.createElement('p', {
          style: {
            color: '#4a5568',
            lineHeight: '1.6',
            marginBottom: '1rem',
          }
        }, content.description),
        
        content.tags && React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            },
          },
          content.tags.map((tag: string, index: number) =>
            React.createElement('span', {
              key: index,
              style: {
                padding: '0.25rem 0.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }
            }, tag)
          )
        )
      )
    );

    return React.createElement('div', cardProps, ...cardElements);
  }

  private renderHighQualityList(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const items = Array.isArray(content.items) ? content.items : [];
    
    const listProps = {
      ...props,
      style: {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: context.viewport.deviceType === 'desktop' 
          ? 'repeat(auto-fit, minmax(300px, 1fr))'
          : '1fr',
        ...props.style,
      },
    };

    const listItems = items.map((item: any, index: number) =>
      React.createElement(
        'div',
        {
          key: index,
          style: {
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
            animation: this.hasReducedMotion(context) ? 'none' : `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          },
        },
        React.createElement('h4', {
          style: {
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#2d3748',
          }
        }, item.title || item.name || String(item))
      )
    );

    return React.createElement('div', listProps, ...listItems);
  }

  private renderHighQualityGeneric(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const textContent = typeof content === 'string'
      ? content
      : content?.text || content?.title || JSON.stringify(content);

    return React.createElement(
      'div',
      {
        ...props,
        style: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          lineHeight: '1.7',
          fontSize: '1rem',
          color: '#2d3748',
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          ...props.style,
        },
      },
      textContent
    );
  }

  private detectContentType(content: any): ContentType {
    if (typeof content === 'string') {
      return ContentType.TEXT;
    }

    if (content?.hero || content?.backgroundImage) {
      return ContentType.HERO;
    }

    if (content?.src || content?.url || content?.image) {
      return ContentType.IMAGE;
    }

    if (content?.items && Array.isArray(content.items)) {
      if (content.type === 'carousel') {
        return ContentType.CAROUSEL;
      }
      return ContentType.LIST;
    }

    if (content?.title && (content?.description || content?.image)) {
      return ContentType.CARD;
    }

    return ContentType.TEXT;
  }

  private generateGradient(index: number): string {
    const gradients = [
      '#667eea, #764ba2',
      '#f093fb, #f5576c',
      '#4facfe, #00f2fe',
      '#43e97b, #38f9d7',
      '#fad0c4, #ffd1ff',
      '#a8edea, #fed6e3',
    ];
    return gradients[index % gradients.length];
  }

  private getAppliedQualityFeatures(
    data: RenderData,
    context: RenderContext
  ): string[] {
    const features = [
      'high_resolution',
      'smooth_animations',
      'advanced_shadows',
      'gradient_backgrounds',
      'premium_typography',
    ];

    if (!this.hasReducedMotion(context)) {
      features.push('parallax_effects', 'hover_animations', 'entrance_animations');
    }

    if (context.viewport.deviceType === 'desktop') {
      features.push('large_layouts', 'grid_systems');
    }

    if (context.features.webGL) {
      features.push('webgl_effects');
    }

    return features;
  }

  shouldCache(data: RenderData, context: RenderContext): boolean {
    // Cache less aggressively to allow for dynamic quality enhancements
    return !this.hasInteractiveElements(data) && this.getContentSize(data) < 5000;
  }
}