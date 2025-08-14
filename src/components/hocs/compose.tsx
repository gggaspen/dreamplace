/**
 * compose utility
 *
 * Utility function for composing multiple Higher-Order Components.
 * Allows clean chaining of HOCs without deep nesting.
 */

import { ComponentType } from 'react';

type HOC<P = any> = (component: ComponentType<P>) => ComponentType<P>;

/**
 * Compose multiple HOCs into a single HOC
 * Usage: compose(withErrorBoundary, withLoadingState, withResponsive)(Component)
 */
export function compose<P = any>(...hocs: HOC<any>[]): HOC<P> {
  return (component: ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), component);
  };
}

/**
 * Pipe HOCs from left to right (more intuitive order)
 * Usage: pipe(withErrorBoundary, withLoadingState, withResponsive)(Component)
 */
export function pipe<P = any>(...hocs: HOC<any>[]): HOC<P> {
  return (component: ComponentType<P>) => {
    return hocs.reduce((acc, hoc) => hoc(acc), component);
  };
}
