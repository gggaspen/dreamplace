import React from 'react';
import { BaseRenderStrategy } from '../BaseRenderStrategy';
import { RenderData, RenderContext, RenderResult, ContentType } from '../types';

/**
 * Performance Render Strategy - optimized for speed and low resource usage
 * Prioritizes fast rendering over visual complexity
 */
export class PerformanceRenderStrategy extends BaseRenderStrategy {
  constructor() {
    super('performance', 'Optimized for speed and low resource usage');
  }

  canHandle(data: RenderData, context: RenderContext): boolean {
    // Can handle any content type, but prioritized for low-end devices
    return true;
  }

  getPriority(data: RenderData, context: RenderContext): number {
    let priority = 3; // Base priority

    // Higher priority for low-end devices
    if (this.isLowEndDevice(context)) {
      priority += 5;
    }

    // Higher priority for slow connections
    if (this.isSlowConnection(context)) {
      priority += 3;
    }

    // Higher priority for mobile devices
    if (this.isMobile(context)) {
      priority += 2;
    }

    // Lower priority for large content
    if (this.getContentSize(data) > 10000) {
      priority -= 2;
    }

    return Math.max(1, priority);
  }

  async render(data: RenderData, context: RenderContext): Promise<RenderResult> {
    const startTime = this.startPerformanceTracking();

    try {
      const element = await this.renderOptimized(data, context);
      const renderTime = this.endPerformanceTracking(startTime);

      return this.createRenderResult(element, renderTime, {
        optimizations: this.getAppliedOptimizations(data, context),
      });
    } catch (error) {
      this.log('Performance render failed', error);
      throw error;
    }
  }

  private async renderOptimized(
    data: RenderData,
    context: RenderContext
  ): Promise<React.ReactElement> {
    const { content, props = {} } = data;
    const optimizations = this.getAppliedOptimizations(data, context);

    // Apply performance optimizations based on content type
    const contentType = this.detectContentType(content);

    switch (contentType) {
      case ContentType.IMAGE:
        return this.renderOptimizedImage(content, props, context, optimizations);

      case ContentType.LIST:
        return this.renderOptimizedList(content, props, context, optimizations);

      case ContentType.CAROUSEL:
        return this.renderOptimizedCarousel(content, props, context, optimizations);

      default:
        return this.renderOptimizedGeneric(content, props, context, optimizations);
    }
  }

  private renderOptimizedImage(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext,
    optimizations: string[]
  ): React.ReactElement {
    const imageProps: any = {
      ...props,
      loading: 'lazy',
      decoding: 'async',
    };

    // Reduce quality for low-end devices
    if (this.isLowEndDevice(context)) {
      imageProps.quality = 60;
    }

    // Use smaller sizes for mobile
    if (this.isMobile(context)) {
      imageProps.sizes = '(max-width: 768px) 100vw, 50vw';
    }

    return React.createElement('img', imageProps);
  }

  private renderOptimizedList(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext,
    optimizations: string[]
  ): React.ReactElement {
    const items = Array.isArray(content.items) ? content.items : [];

    // Limit items for performance
    const maxItems = this.isLowEndDevice(context) ? 20 : 50;
    const limitedItems = items.slice(0, maxItems);

    const listProps = {
      ...props,
      role: 'list',
    };

    return React.createElement(
      'div',
      listProps,
      limitedItems.map((item: any, index: number) =>
        React.createElement(
          'div',
          { key: index, role: 'listitem' },
          String(item.title || item.name || item)
        )
      )
    );
  }

  private renderOptimizedCarousel(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext,
    optimizations: string[]
  ): React.ReactElement {
    // Use simple horizontal scroll instead of complex carousel for performance
    const carouselProps = {
      ...props,
      style: {
        display: 'flex',
        overflowX: 'auto' as const,
        gap: '1rem',
        ...props.style,
      },
    };

    const items = Array.isArray(content.items) ? content.items : [];

    return React.createElement(
      'div',
      carouselProps,
      items.map((item: any, index: number) =>
        React.createElement(
          'div',
          {
            key: index,
            style: { flexShrink: 0, minWidth: this.isMobile(context) ? '250px' : '300px' },
          },
          String(item.title || item.name || item)
        )
      )
    );
  }

  private renderOptimizedGeneric(
    content: any,
    props: Record<string, unknown>,
    context: RenderContext,
    optimizations: string[]
  ): React.ReactElement {
    // Simple text rendering for unknown content types
    const textContent =
      typeof content === 'string'
        ? content
        : content?.text || content?.title || JSON.stringify(content);

    return React.createElement(
      'div',
      {
        ...props,
        style: {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.5,
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

    if (content?.src || content?.url || content?.image) {
      return ContentType.IMAGE;
    }

    if (content?.items && Array.isArray(content.items)) {
      if (content.type === 'carousel') {
        return ContentType.CAROUSEL;
      }
      return ContentType.LIST;
    }

    return ContentType.TEXT;
  }

  private getAppliedOptimizations(data: RenderData, context: RenderContext): string[] {
    const optimizations: string[] = [];

    if (this.isLowEndDevice(context)) {
      optimizations.push('reduced_complexity', 'limited_animations', 'smaller_images');
    }

    if (this.isMobile(context)) {
      optimizations.push('mobile_layout', 'touch_optimized');
    }

    if (this.isSlowConnection(context)) {
      optimizations.push('lazy_loading', 'progressive_enhancement');
    }

    if (this.hasReducedMotion(context)) {
      optimizations.push('no_animations');
    }

    return optimizations;
  }

  shouldCache(data: RenderData, context: RenderContext): boolean {
    // Cache aggressively for performance
    return !this.hasInteractiveElements(data);
  }
}
