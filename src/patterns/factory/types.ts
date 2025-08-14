/**
 * Factory Pattern Implementation for Component Creation
 *
 * The Factory pattern provides an interface for creating objects without
 * specifying the exact class of object that will be created. This allows
 * for flexible component instantiation based on runtime conditions.
 */

import { ReactElement, ComponentType } from 'react';

export interface ComponentConfig {
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | string;
  metadata?: ComponentMetadata;
}

export interface ComponentMetadata {
  id?: string;
  version?: string;
  theme?: string;
  accessibility?: AccessibilityConfig;
  performance?: PerformanceConfig;
  responsive?: ResponsiveConfig;
}

export interface AccessibilityConfig {
  level: 'basic' | 'enhanced' | 'full';
  screenReader?: boolean;
  keyboardNav?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}

export interface PerformanceConfig {
  lazy?: boolean;
  priority: 'low' | 'medium' | 'high';
  caching?: boolean;
  preload?: boolean;
}

export interface ResponsiveConfig {
  breakpoints?: {
    mobile?: ComponentConfig;
    tablet?: ComponentConfig;
    desktop?: ComponentConfig;
  };
  adaptive?: boolean;
}

export interface IComponentFactory {
  name: string;
  canCreate(config: ComponentConfig): boolean;
  create(config: ComponentConfig, context?: CreationContext): Promise<ReactElement> | ReactElement;
  getMetadata(): FactoryMetadata;
}

export interface CreationContext {
  theme?: string;
  locale?: string;
  user?: {
    preferences?: Record<string, unknown>;
    accessibility?: AccessibilityConfig;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    capabilities: DeviceCapabilities;
  };
  environment?: {
    mode: 'development' | 'production' | 'test';
    features: string[];
  };
}

export interface DeviceCapabilities {
  touch?: boolean;
  webGL?: boolean;
  serviceWorker?: boolean;
  intersectionObserver?: boolean;
  resizeObserver?: boolean;
}

export interface FactoryMetadata {
  name: string;
  description: string;
  version: string;
  supportedTypes: string[];
  dependencies?: string[];
}

export interface IComponentFactoryRegistry {
  register(factory: IComponentFactory): void;
  unregister(factoryName: string): boolean;
  getFactory(type: string): IComponentFactory | null;
  getAllFactories(): IComponentFactory[];
  create(config: ComponentConfig, context?: CreationContext): Promise<ReactElement>;
  canCreate(type: string): boolean;
}

export enum ComponentType {
  // Layout components
  CONTAINER = 'container',
  GRID = 'grid',
  FLEX = 'flex',
  STACK = 'stack',

  // UI components
  BUTTON = 'button',
  INPUT = 'input',
  CARD = 'card',
  MODAL = 'modal',
  TOOLTIP = 'tooltip',

  // Data display
  LIST = 'list',
  TABLE = 'table',
  CHART = 'chart',
  IMAGE = 'image',
  VIDEO = 'video',

  // Navigation
  MENU = 'menu',
  BREADCRUMB = 'breadcrumb',
  PAGINATION = 'pagination',
  TABS = 'tabs',

  // Form components
  FORM = 'form',
  FIELD_GROUP = 'field_group',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',

  // Specialized
  CAROUSEL = 'carousel',
  HERO = 'hero',
  TESTIMONIAL = 'testimonial',
  PRICING = 'pricing',
  TIMELINE = 'timeline',
}

export enum FactoryType {
  BASIC = 'basic',
  THEMED = 'themed',
  RESPONSIVE = 'responsive',
  ACCESSIBLE = 'accessible',
  PERFORMANCE = 'performance',
  COMPOSITE = 'composite',
}
