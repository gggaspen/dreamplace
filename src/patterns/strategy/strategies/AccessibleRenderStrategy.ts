import React from 'react';
import { BaseRenderStrategy } from '../BaseRenderStrategy';
import { RenderData, RenderContext, RenderResult, ContentType } from '../types';

/**
 * Accessible Render Strategy - optimized for accessibility and screen readers
 * Prioritizes semantic HTML, ARIA attributes, and keyboard navigation
 */
export class AccessibleRenderStrategy extends BaseRenderStrategy {
  constructor() {
    super('accessible', 'Optimized for accessibility and screen readers');
  }

  canHandle(data: RenderData, context: RenderContext): boolean {
    // Can handle any content type
    return true;
  }

  getPriority(data: RenderData, context: RenderContext): number {
    let priority = 2; // Base priority

    // Higher priority when accessibility features are detected or requested
    if (context.user.accessibility?.screenReader) {
      priority += 8;
    }

    if (context.user.accessibility?.highContrast) {
      priority += 6;
    }

    if (context.user.accessibility?.reducedMotion) {
      priority += 4;
    }

    // Higher priority for form content (needs accessibility)
    const contentType = this.detectContentType(data.content);
    if (contentType === ContentType.FORM || contentType === ContentType.INTERACTIVE) {
      priority += 3;
    }

    return Math.max(1, priority);
  }

  async render(data: RenderData, context: RenderContext): Promise<RenderResult> {
    const startTime = this.startPerformanceTracking();

    try {
      const element = await this.renderAccessible(data, context);
      const renderTime = this.endPerformanceTracking(startTime);

      return this.createRenderResult(element, renderTime, {
        accessibilityFeatures: this.getAppliedAccessibilityFeatures(data, context),
      });
    } catch (error) {
      this.log('Accessible render failed', error);
      throw error;
    }
  }

  private async renderAccessible(
    data: RenderData,
    context: RenderContext
  ): Promise<React.ReactElement> {
    const { content, props = {} } = data;
    const contentType = this.detectContentType(content);

    switch (contentType) {
      case ContentType.IMAGE:
        return this.renderAccessibleImage(content, props, context);
      
      case ContentType.LIST:
        return this.renderAccessibleList(content, props, context);
      
      case ContentType.CAROUSEL:
        return this.renderAccessibleCarousel(content, props, context);
      
      case ContentType.FORM:
        return this.renderAccessibleForm(content, props, context);
      
      case ContentType.CARD:
        return this.renderAccessibleCard(content, props, context);
      
      default:
        return this.renderAccessibleGeneric(content, props, context);
    }
  }

  private renderAccessibleImage(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const imageProps: any = {
      ...props,
      alt: content.alt || content.description || content.title || 'Image',
      role: content.decorative ? 'presentation' : 'img',
    };

    // Add longdesc for complex images
    if (content.longDescription) {
      imageProps['aria-describedby'] = 'img-description';
    }

    // High contrast adjustments
    if (context.user.accessibility?.highContrast) {
      imageProps.style = {
        ...imageProps.style,
        filter: 'contrast(150%)',
        border: '1px solid currentColor',
      };
    }

    const elements = [
      React.createElement('img', { ...imageProps, key: 'image' })
    ];

    // Add description element if needed
    if (content.longDescription) {
      elements.push(
        React.createElement(
          'div',
          { 
            id: 'img-description',
            className: 'sr-only',
            key: 'description'
          },
          content.longDescription
        )
      );
    }

    return React.createElement(React.Fragment, {}, ...elements);
  }

  private renderAccessibleList(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const items = Array.isArray(content.items) ? content.items : [];
    const listType = content.ordered ? 'ol' : 'ul';
    
    const listProps = {
      ...props,
      role: 'list',
      'aria-label': content.label || 'List',
    };

    if (content.description) {
      listProps['aria-describedby'] = 'list-description';
    }

    const listItems = items.map((item: any, index: number) => {
      const itemContent = item.title || item.name || item.text || String(item);
      
      return React.createElement(
        'li',
        { 
          key: index,
          role: 'listitem',
          tabIndex: item.interactive ? 0 : undefined,
          'aria-setsize': items.length,
          'aria-posinset': index + 1,
        },
        itemContent
      );
    });

    const elements = [];

    // Add description if provided
    if (content.description) {
      elements.push(
        React.createElement(
          'div',
          { 
            id: 'list-description',
            className: 'sr-only',
            key: 'description'
          },
          content.description
        )
      );
    }

    elements.push(
      React.createElement(listType, { ...listProps, key: 'list' }, ...listItems)
    );

    return React.createElement(React.Fragment, {}, ...elements);
  }

  private renderAccessibleCarousel(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const items = Array.isArray(content.items) ? content.items : [];
    
    const carouselProps = {
      ...props,
      role: 'region',
      'aria-label': content.label || 'Carousel',
      'aria-live': 'polite',
    };

    // Create carousel container with proper ARIA attributes
    const carouselContainer = React.createElement(
      'div',
      carouselProps,
      
      // Carousel content
      React.createElement(
        'div',
        {
          role: 'group',
          'aria-label': `${items.length} items`,
        },
        items.map((item: any, index: number) =>
          React.createElement(
            'div',
            {
              key: index,
              role: 'group',
              'aria-label': `Item ${index + 1} of ${items.length}`,
              tabIndex: 0,
            },
            item.title || item.name || String(item)
          )
        )
      ),
      
      // Navigation instructions for screen readers
      React.createElement(
        'div',
        { className: 'sr-only' },
        'Use arrow keys to navigate between carousel items'
      )
    );

    return carouselContainer;
  }

  private renderAccessibleForm(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const fields = Array.isArray(content.fields) ? content.fields : [];
    
    const formProps = {
      ...props,
      role: 'form',
      'aria-label': content.title || 'Form',
      noValidate: true, // Use custom validation for better accessibility
    };

    if (content.description) {
      formProps['aria-describedby'] = 'form-description';
    }

    const formElements = [];

    // Add form description
    if (content.description) {
      formElements.push(
        React.createElement(
          'div',
          { 
            id: 'form-description',
            key: 'description'
          },
          content.description
        )
      );
    }

    // Add form fields
    formElements.push(
      ...fields.map((field: any, index: number) => {
        const fieldId = `field-${index}`;
        const errorId = `${fieldId}-error`;
        const helpId = `${fieldId}-help`;
        
        const inputProps: any = {
          id: fieldId,
          name: field.name || fieldId,
          type: field.type || 'text',
          required: field.required,
          'aria-describedby': '',
        };

        // Build aria-describedby
        const describedBy = [];
        if (field.help) describedBy.push(helpId);
        if (field.error) describedBy.push(errorId);
        if (describedBy.length > 0) {
          inputProps['aria-describedby'] = describedBy.join(' ');
        }

        if (field.error) {
          inputProps['aria-invalid'] = 'true';
        }

        const fieldElements = [
          // Label
          React.createElement(
            'label',
            { htmlFor: fieldId, key: `${fieldId}-label` },
            field.label || field.name
          ),
          
          // Input
          React.createElement('input', { ...inputProps, key: fieldId }),
        ];

        // Help text
        if (field.help) {
          fieldElements.push(
            React.createElement(
              'div',
              { id: helpId, key: `${fieldId}-help` },
              field.help
            )
          );
        }

        // Error message
        if (field.error) {
          fieldElements.push(
            React.createElement(
              'div',
              { 
                id: errorId,
                role: 'alert',
                'aria-live': 'assertive',
                key: `${fieldId}-error`
              },
              field.error
            )
          );
        }

        return React.createElement(
          'div',
          { key: index, className: 'field-group' },
          ...fieldElements
        );
      })
    );

    return React.createElement('form', formProps, ...formElements);
  }

  private renderAccessibleCard(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const cardProps = {
      ...props,
      role: 'article',
      tabIndex: content.interactive ? 0 : undefined,
      'aria-label': content.title || 'Card',
    };

    if (content.description) {
      cardProps['aria-describedby'] = 'card-description';
    }

    const cardElements = [];

    // Title
    if (content.title) {
      cardElements.push(
        React.createElement('h3', { key: 'title' }, content.title)
      );
    }

    // Description
    if (content.description) {
      cardElements.push(
        React.createElement(
          'div',
          { id: 'card-description', key: 'description' },
          content.description
        )
      );
    }

    // Content
    if (content.content) {
      cardElements.push(
        React.createElement('div', { key: 'content' }, content.content)
      );
    }

    return React.createElement('div', cardProps, ...cardElements);
  }

  private renderAccessibleGeneric(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext
  ): React.ReactElement {
    const textContent = typeof content === 'string'
      ? content
      : content?.text || content?.title || JSON.stringify(content);

    const elementProps = {
      ...props,
      role: 'text',
    };

    // Add high contrast styles if needed
    if (context.user.accessibility?.highContrast) {
      elementProps.style = {
        ...elementProps.style,
        color: 'CanvasText',
        backgroundColor: 'Canvas',
        border: '1px solid ButtonBorder',
      };
    }

    return React.createElement('div', elementProps, textContent);
  }

  private detectContentType(content: any): ContentType {
    if (typeof content === 'string') {
      return ContentType.TEXT;
    }

    if (content?.fields && Array.isArray(content.fields)) {
      return ContentType.FORM;
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

    if (content?.interactive || content?.clickable) {
      return ContentType.INTERACTIVE;
    }

    if (content?.title && content?.description) {
      return ContentType.CARD;
    }

    return ContentType.TEXT;
  }

  private getAppliedAccessibilityFeatures(
    data: RenderData,
    context: RenderContext
  ): string[] {
    const features: string[] = [
      'semantic_html',
      'aria_labels',
      'keyboard_navigation',
      'screen_reader_support',
    ];

    if (context.user.accessibility?.highContrast) {
      features.push('high_contrast');
    }

    if (context.user.accessibility?.reducedMotion) {
      features.push('reduced_motion');
    }

    if (context.user.accessibility?.screenReader) {
      features.push('screen_reader_optimized');
    }

    return features;
  }

  shouldCache(data: RenderData, context: RenderContext): boolean {
    // Cache accessible content, but be careful with interactive elements
    return !this.hasInteractiveElements(data) || !data.props?.dynamic;
  }
}