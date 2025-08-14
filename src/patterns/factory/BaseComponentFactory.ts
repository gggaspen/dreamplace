import { ReactElement } from 'react';
import { 
  IComponentFactory, 
  ComponentConfig, 
  CreationContext, 
  FactoryMetadata,
  ComponentMetadata 
} from './types';

/**
 * Base implementation of the ComponentFactory interface
 * Provides common functionality for all component factories
 */
export abstract class BaseComponentFactory implements IComponentFactory {
  public readonly name: string;
  protected metadata: FactoryMetadata;
  protected creationCount: number = 0;

  constructor(metadata: FactoryMetadata) {
    this.name = metadata.name;
    this.metadata = metadata;
  }

  abstract canCreate(config: ComponentConfig): boolean;
  abstract create(config: ComponentConfig, context?: CreationContext): Promise<ReactElement> | ReactElement;

  getMetadata(): FactoryMetadata {
    return { ...this.metadata };
  }

  protected validateConfig(config: ComponentConfig): void {
    if (!config.type) {
      throw new Error('Component configuration must have a type');
    }

    if (!this.canCreate(config)) {
      throw new Error(`Factory ${this.name} cannot create component of type ${config.type}`);
    }
  }

  protected enrichConfig(config: ComponentConfig, context?: CreationContext): ComponentConfig {
    const enrichedConfig = { ...config };

    // Add default metadata if not present
    if (!enrichedConfig.metadata) {
      enrichedConfig.metadata = {};
    }

    // Enrich with context information
    if (context) {
      enrichedConfig.metadata = {
        ...enrichedConfig.metadata,
        theme: context.theme || enrichedConfig.metadata.theme,
        accessibility: this.mergeAccessibilityConfig(
          enrichedConfig.metadata.accessibility,
          context.user?.accessibility
        ),
      };
    }

    // Add creation timestamp and ID
    enrichedConfig.metadata.id = enrichedConfig.metadata.id || this.generateComponentId();

    return enrichedConfig;
  }

  protected mergeAccessibilityConfig(
    configA11y?: any,
    contextA11y?: any
  ): any {
    return {
      level: 'basic',
      ...configA11y,
      ...contextA11y,
    };
  }

  protected generateComponentId(): string {
    this.creationCount++;
    return `${this.name}_${Date.now()}_${this.creationCount}`;
  }

  protected applyTheme(props: Record<string, unknown>, theme?: string): Record<string, unknown> {
    if (!theme) return props;

    // Apply theme-specific styling
    const themedProps = { ...props };
    
    switch (theme) {
      case 'dark':
        themedProps.className = `${props.className || ''} theme-dark`.trim();
        break;
      case 'light':
        themedProps.className = `${props.className || ''} theme-light`.trim();
        break;
      case 'high-contrast':
        themedProps.className = `${props.className || ''} theme-high-contrast`.trim();
        break;
      default:
        themedProps.className = `${props.className || ''} theme-${theme}`.trim();
    }

    return themedProps;
  }

  protected applyAccessibility(
    props: Record<string, unknown>, 
    a11yConfig?: any
  ): Record<string, unknown> {
    if (!a11yConfig) return props;

    const accessibleProps = { ...props };

    // Enhanced accessibility features
    if (a11yConfig.level === 'enhanced' || a11yConfig.level === 'full') {
      accessibleProps.role = accessibleProps.role || this.getDefaultRole(props);
      
      if (a11yConfig.keyboardNav) {
        accessibleProps.tabIndex = accessibleProps.tabIndex ?? 0;
      }

      if (a11yConfig.screenReader) {
        accessibleProps['aria-label'] = accessibleProps['aria-label'] || 'Interactive element';
      }
    }

    // Reduced motion
    if (a11yConfig.reducedMotion) {
      accessibleProps.className = `${accessibleProps.className || ''} reduced-motion`.trim();
    }

    // High contrast
    if (a11yConfig.highContrast) {
      accessibleProps.className = `${accessibleProps.className || ''} high-contrast`.trim();
    }

    return accessibleProps;
  }

  protected getDefaultRole(props: Record<string, unknown>): string {
    if (props.onClick || props.onKeyDown) return 'button';
    if (props.href) return 'link';
    return 'generic';
  }

  protected applyPerformanceOptimizations(
    element: ReactElement,
    perfConfig?: any
  ): ReactElement {
    if (!perfConfig) return element;

    let optimizedElement = element;

    // Lazy loading
    if (perfConfig.lazy) {
      // In a real implementation, this would wrap with React.lazy or Suspense
      optimizedElement = element; // Placeholder for lazy loading logic
    }

    // Caching
    if (perfConfig.caching) {
      // In a real implementation, this would wrap with React.memo
      optimizedElement = element; // Placeholder for memoization logic
    }

    return optimizedElement;
  }

  protected handleResponsive(
    config: ComponentConfig,
    context?: CreationContext
  ): ComponentConfig {
    if (!config.metadata?.responsive || !context?.device) {
      return config;
    }

    const { responsive } = config.metadata;
    const deviceType = context.device.type;

    // Use device-specific configuration if available
    if (responsive.breakpoints) {
      const deviceConfig = responsive.breakpoints[deviceType];
      if (deviceConfig) {
        return {
          ...config,
          ...deviceConfig,
          metadata: {
            ...config.metadata,
            ...deviceConfig.metadata,
          },
        };
      }
    }

    return config;
  }

  protected log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.name}Factory] ${message}`, data || '');
    }
  }

  // Statistics
  getCreationCount(): number {
    return this.creationCount;
  }

  getStatistics(): {
    name: string;
    creationCount: number;
    supportedTypes: string[];
  } {
    return {
      name: this.name,
      creationCount: this.creationCount,
      supportedTypes: this.metadata.supportedTypes,
    };
  }
}