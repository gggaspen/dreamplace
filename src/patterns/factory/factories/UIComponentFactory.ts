import React, { ReactElement } from 'react';
import { BaseComponentFactory } from '../BaseComponentFactory';
import { ComponentConfig, CreationContext, ComponentType } from '../types';

/**
 * UI Component Factory - creates common UI components
 */
export class UIComponentFactory extends BaseComponentFactory {
  constructor() {
    super({
      name: 'UIComponentFactory',
      description: 'Factory for creating common UI components',
      version: '1.0.0',
      supportedTypes: [
        ComponentType.BUTTON,
        ComponentType.INPUT,
        ComponentType.CARD,
        ComponentType.MODAL,
        ComponentType.TOOLTIP,
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
      case ComponentType.BUTTON:
        return this.createButton(responsiveConfig, context);
      case ComponentType.INPUT:
        return this.createInput(responsiveConfig, context);
      case ComponentType.CARD:
        return this.createCard(responsiveConfig, context);
      case ComponentType.MODAL:
        return this.createModal(responsiveConfig, context);
      case ComponentType.TOOLTIP:
        return this.createTooltip(responsiveConfig, context);
      default:
        throw new Error(`Unsupported component type: ${responsiveConfig.type}`);
    }
  }

  private createButton(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let buttonProps = {
      type: 'button',
      ...props,
    };

    // Apply theme
    buttonProps = this.applyTheme(buttonProps, metadata?.theme);
    
    // Apply accessibility
    buttonProps = this.applyAccessibility(buttonProps, metadata?.accessibility);

    // Apply variant styling
    const variant = props.variant || 'primary';
    buttonProps.className = `${buttonProps.className || ''} btn btn-${variant}`.trim();

    // Apply size styling
    const size = props.size || 'medium';
    buttonProps.className = `${buttonProps.className} btn-${size}`.trim();

    // Loading state
    if (props.loading) {
      buttonProps.disabled = true;
      buttonProps.className = `${buttonProps.className} btn-loading`.trim();
    }

    // Icon support
    const children = [];
    if (props.icon && props.iconPosition !== 'right') {
      children.push(React.createElement('span', { 
        key: 'icon-left',
        className: 'btn-icon btn-icon-left' 
      }, props.icon));
    }

    children.push(React.createElement('span', { 
      key: 'text',
      className: 'btn-text' 
    }, config.children || props.children || 'Button'));

    if (props.icon && props.iconPosition === 'right') {
      children.push(React.createElement('span', { 
        key: 'icon-right',
        className: 'btn-icon btn-icon-right' 
      }, props.icon));
    }

    const element = React.createElement('button', buttonProps, ...children);
    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private createInput(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let inputProps = {
      type: 'text',
      ...props,
    };

    // Apply theme
    inputProps = this.applyTheme(inputProps, metadata?.theme);
    
    // Apply accessibility
    inputProps = this.applyAccessibility(inputProps, metadata?.accessibility);

    // Input styling
    inputProps.className = `${inputProps.className || ''} input`.trim();

    // Size styling
    const size = props.size || 'medium';
    inputProps.className = `${inputProps.className} input-${size}`.trim();

    // State styling
    if (props.error) {
      inputProps.className = `${inputProps.className} input-error`.trim();
      inputProps['aria-invalid'] = 'true';
    }

    if (props.disabled) {
      inputProps.className = `${inputProps.className} input-disabled`.trim();
    }

    // Create input wrapper with label and error message
    const elements = [];

    // Label
    if (props.label) {
      elements.push(React.createElement('label', {
        key: 'label',
        htmlFor: inputProps.id,
        className: 'input-label'
      }, props.label));
    }

    // Input element
    elements.push(React.createElement('input', { ...inputProps, key: 'input' }));

    // Error message
    if (props.error) {
      elements.push(React.createElement('div', {
        key: 'error',
        className: 'input-error-message',
        role: 'alert'
      }, props.error));
    }

    // Help text
    if (props.help) {
      elements.push(React.createElement('div', {
        key: 'help',
        className: 'input-help-text'
      }, props.help));
    }

    const wrapper = React.createElement('div', {
      className: 'input-wrapper'
    }, ...elements);

    return this.applyPerformanceOptimizations(wrapper, metadata?.performance);
  }

  private createCard(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let cardProps = {
      ...props,
    };

    // Apply theme
    cardProps = this.applyTheme(cardProps, metadata?.theme);
    
    // Apply accessibility
    cardProps = this.applyAccessibility(cardProps, metadata?.accessibility);

    // Card styling
    cardProps.className = `${cardProps.className || ''} card`.trim();

    // Variant styling
    const variant = props.variant || 'default';
    cardProps.className = `${cardProps.className} card-${variant}`.trim();

    // Interactive styling
    if (props.interactive || props.onClick) {
      cardProps.className = `${cardProps.className} card-interactive`.trim();
      cardProps.role = cardProps.role || 'button';
      cardProps.tabIndex = cardProps.tabIndex ?? 0;
    }

    // Build card content
    const children = [];

    // Header
    if (props.header || props.title) {
      const headerContent = [];
      
      if (props.title) {
        headerContent.push(React.createElement('h3', {
          key: 'title',
          className: 'card-title'
        }, props.title));
      }

      if (props.subtitle) {
        headerContent.push(React.createElement('p', {
          key: 'subtitle',
          className: 'card-subtitle'
        }, props.subtitle));
      }

      children.push(React.createElement('div', {
        key: 'header',
        className: 'card-header'
      }, props.header || headerContent));
    }

    // Image
    if (props.image) {
      children.push(React.createElement('img', {
        key: 'image',
        src: props.image,
        alt: props.imageAlt || '',
        className: 'card-image'
      }));
    }

    // Body
    if (config.children || props.content) {
      children.push(React.createElement('div', {
        key: 'body',
        className: 'card-body'
      }, config.children || props.content));
    }

    // Footer
    if (props.footer || props.actions) {
      children.push(React.createElement('div', {
        key: 'footer',
        className: 'card-footer'
      }, props.footer || props.actions));
    }

    const element = React.createElement('div', cardProps, ...children);
    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }

  private createModal(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    // Modal backdrop
    const backdropProps = {
      className: 'modal-backdrop',
      onClick: props.onBackdropClick || props.onClose,
    };

    // Modal content
    let modalProps = {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': props.titleId,
      ...props,
    };

    // Apply theme
    modalProps = this.applyTheme(modalProps, metadata?.theme);
    
    // Apply accessibility
    modalProps = this.applyAccessibility(modalProps, metadata?.accessibility);

    // Modal styling
    modalProps.className = `${modalProps.className || ''} modal`.trim();

    // Size styling
    const size = props.size || 'medium';
    modalProps.className = `${modalProps.className} modal-${size}`.trim();

    // Build modal content
    const children = [];

    // Header
    if (props.title || props.closable !== false) {
      const headerContent = [];
      
      if (props.title) {
        headerContent.push(React.createElement('h2', {
          key: 'title',
          id: props.titleId,
          className: 'modal-title'
        }, props.title));
      }

      if (props.closable !== false) {
        headerContent.push(React.createElement('button', {
          key: 'close',
          type: 'button',
          className: 'modal-close',
          onClick: props.onClose,
          'aria-label': 'Close modal'
        }, '×'));
      }

      children.push(React.createElement('div', {
        key: 'header',
        className: 'modal-header'
      }, ...headerContent));
    }

    // Body
    children.push(React.createElement('div', {
      key: 'body',
      className: 'modal-body'
    }, config.children || props.content));

    // Footer
    if (props.footer || props.actions) {
      children.push(React.createElement('div', {
        key: 'footer',
        className: 'modal-footer'
      }, props.footer || props.actions));
    }

    const modalContent = React.createElement('div', modalProps, ...children);
    
    const backdrop = React.createElement('div', backdropProps, modalContent);
    
    return this.applyPerformanceOptimizations(backdrop, metadata?.performance);
  }

  private createTooltip(config: ComponentConfig, context?: CreationContext): ReactElement {
    const { props = {}, metadata } = config;
    
    let tooltipProps = {
      role: 'tooltip',
      ...props,
    };

    // Apply theme
    tooltipProps = this.applyTheme(tooltipProps, metadata?.theme);
    
    // Apply accessibility
    tooltipProps = this.applyAccessibility(tooltipProps, metadata?.accessibility);

    // Tooltip styling
    tooltipProps.className = `${tooltipProps.className || ''} tooltip`.trim();

    // Position styling
    const position = props.position || 'top';
    tooltipProps.className = `${tooltipProps.className} tooltip-${position}`.trim();

    const element = React.createElement('div', tooltipProps, config.children || props.content);
    return this.applyPerformanceOptimizations(element, metadata?.performance);
  }
}