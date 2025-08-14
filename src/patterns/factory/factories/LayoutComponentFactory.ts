import React, { ReactElement } from 'react';
import { BaseComponentFactory } from '../BaseComponentFactory';
import { ComponentConfig, CreationContext, ComponentType } from '../types';

/**
 * Layout Component Factory - creates layout and structural components
 */
export class LayoutComponentFactory extends BaseComponentFactory {
  constructor() {
    super({
      name: 'LayoutComponentFactory',
      description: 'Factory for creating layout and structural components',
      version: '1.0.0',
      supportedTypes: [
        ComponentType.CONTAINER,
        ComponentType.GRID,
        ComponentType.FLEX,
        ComponentType.STACK,
      ],
    });
  }

  canCreate(config: ComponentConfig): boolean {
    return this.metadata.supportedTypes.includes(config.type as ComponentType);
  }

  create(config: ComponentConfig, context?: CreationContext): ReactElement {
    this.validateConfig(config);
    
    const enrichedConfig = this.enrichConfig(config, context);
    const responsiveConfig = this.handleResponsive(enrichedConfig, context);

    switch (responsiveConfig.type) {
      case ComponentType.CONTAINER:
        return this.createContainer(responsiveConfig, context);
      case ComponentType.GRID:
        return this.createGrid(responsiveConfig, context);
      case ComponentType.FLEX:
        return this.createFlex(responsiveConfig, context);
      case ComponentType.STACK:
        return this.createStack(responsiveConfig, context);
      default:
        throw new Error(`Unsupported component type: ${responsiveConfig.type}`);
    }
  }

  private createContainer(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let containerProps = {
      ...props,
    };

    // Apply theme
    containerProps = this.applyTheme(containerProps, metadata?.theme);
    
    // Apply accessibility
    containerProps = this.applyAccessibility(containerProps, metadata?.accessibility);

    // Container styling
    containerProps.className = `${containerProps.className || ''} container`.trim();

    // Size variant
    const size = props.size || 'full';
    containerProps.className = `${containerProps.className} container-${size}`.trim();

    // Responsive behavior
    if (props.fluid) {
      containerProps.className = `${containerProps.className} container-fluid`.trim();
    }

    // Padding and margin
    if (props.padding) {
      containerProps.className = `${containerProps.className} p-${props.padding}`.trim();
    }

    if (props.margin) {
      containerProps.className = `${containerProps.className} m-${props.margin}`.trim();
    }

    // Center content
    if (props.centered) {
      containerProps.className = `${containerProps.className} container-centered`.trim();
    }

    const element = React.createElement(
      props.as || 'div',
      containerProps,
      this.renderChildren(config.children, config)
    );

    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private createGrid(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let gridProps = {
      ...props,
    };

    // Apply theme
    gridProps = this.applyTheme(gridProps, metadata?.theme);
    
    // Apply accessibility
    gridProps = this.applyAccessibility(gridProps, metadata?.accessibility);

    // Grid styling
    gridProps.className = `${gridProps.className || ''} grid`.trim();

    // Grid columns
    const columns = props.columns || 12;
    if (typeof columns === 'number') {
      gridProps.className = `${gridProps.className} grid-cols-${columns}`.trim();
    } else if (typeof columns === 'object') {
      // Responsive columns
      Object.entries(columns).forEach(([breakpoint, cols]) => {
        gridProps.className = `${gridProps.className} ${breakpoint}:grid-cols-${cols}`.trim();
      });
    }

    // Gap
    if (props.gap) {
      gridProps.className = `${gridProps.className} gap-${props.gap}`.trim();
    }

    // Responsive gaps
    if (props.responsiveGap) {
      Object.entries(props.responsiveGap).forEach(([breakpoint, gap]) => {
        gridProps.className = `${gridProps.className} ${breakpoint}:gap-${gap}`.trim();
      });
    }

    // Auto-fit/fill
    if (props.autoFit) {
      gridProps.style = {
        ...gridProps.style,
        gridTemplateColumns: `repeat(auto-fit, minmax(${props.minItemWidth || '250px'}, 1fr))`,
      };
    }

    if (props.autoFill) {
      gridProps.style = {
        ...gridProps.style,
        gridTemplateColumns: `repeat(auto-fill, minmax(${props.minItemWidth || '250px'}, 1fr))`,
      };
    }

    const element = React.createElement(
      props.as || 'div',
      gridProps,
      this.renderChildren(config.children, config)
    );

    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private createFlex(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let flexProps = {
      ...props,
    };

    // Apply theme
    flexProps = this.applyTheme(flexProps, metadata?.theme);
    
    // Apply accessibility
    flexProps = this.applyAccessibility(flexProps, metadata?.accessibility);

    // Flex styling
    flexProps.className = `${flexProps.className || ''} flex`.trim();

    // Direction
    const direction = props.direction || 'row';
    flexProps.className = `${flexProps.className} flex-${direction}`.trim();

    // Responsive direction
    if (props.responsiveDirection) {
      Object.entries(props.responsiveDirection).forEach(([breakpoint, dir]) => {
        flexProps.className = `${flexProps.className} ${breakpoint}:flex-${dir}`.trim();
      });
    }

    // Justify content
    if (props.justify) {
      const justifyClass = this.getJustifyClass(props.justify);
      flexProps.className = `${flexProps.className} ${justifyClass}`.trim();
    }

    // Align items
    if (props.align) {
      const alignClass = this.getAlignClass(props.align);
      flexProps.className = `${flexProps.className} ${alignClass}`.trim();
    }

    // Wrap
    if (props.wrap) {
      flexProps.className = `${flexProps.className} flex-wrap`.trim();
    } else if (props.wrap === false) {
      flexProps.className = `${flexProps.className} flex-nowrap`.trim();
    }

    // Gap
    if (props.gap) {
      flexProps.className = `${flexProps.className} gap-${props.gap}`.trim();
    }

    const element = React.createElement(
      props.as || 'div',
      flexProps,
      this.renderChildren(config.children, config)
    );

    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private createStack(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let stackProps = {
      ...props,
    };

    // Apply theme
    stackProps = this.applyTheme(stackProps, metadata?.theme);
    
    // Apply accessibility
    stackProps = this.applyAccessibility(stackProps, metadata?.accessibility);

    // Stack styling
    stackProps.className = `${stackProps.className || ''} stack`.trim();

    // Direction
    const direction = props.direction || 'vertical';
    stackProps.className = `${stackProps.className} stack-${direction}`.trim();

    // Spacing
    if (props.spacing) {
      stackProps.className = `${stackProps.className} stack-spacing-${props.spacing}`.trim();
    }

    // Alignment
    if (props.align) {
      stackProps.className = `${stackProps.className} stack-align-${props.align}`.trim();
    }

    // Dividers
    if (props.divider) {
      stackProps.className = `${stackProps.className} stack-divider`.trim();
    }

    // Responsive behavior
    if (props.responsive) {
      stackProps.className = `${stackProps.className} stack-responsive`.trim();
    }

    const element = React.createElement(
      props.as || 'div',
      stackProps,
      this.renderChildren(config.children, config, props.divider)
    );

    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private renderChildren(children: any, config: ComponentConfig, withDivider?: boolean): React.ReactNode {
    if (!children) return null;

    if (typeof children === 'string') {
      return children;
    }

    if (Array.isArray(children)) {
      if (withDivider && children.length > 1) {
        // Add dividers between children
        const childrenWithDividers: React.ReactNode[] = [];
        
        children.forEach((child, index) => {
          childrenWithDividers.push(
            typeof child === 'object' && child.type
              ? React.createElement('div', { key: `child-${index}` }, child)
              : child
          );
          
          if (index < children.length - 1) {
            childrenWithDividers.push(
              React.createElement('div', { 
                key: `divider-${index}`,
                className: 'stack-divider-line'
              })
            );
          }
        });
        
        return childrenWithDividers;
      }
      
      return children.map((child, index) => 
        typeof child === 'object' && child.type
          ? React.createElement('div', { key: index }, child)
          : child
      );
    }

    return children;
  }

  private getJustifyClass(justify: string): string {
    const justifyMap: Record<string, string> = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    
    return justifyMap[justify] || 'justify-start';
  }

  private getAlignClass(align: string): string {
    const alignMap: Record<string, string> = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    };
    
    return alignMap[align] || 'items-start';
  }
}