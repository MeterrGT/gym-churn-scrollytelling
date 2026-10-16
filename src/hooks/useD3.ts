import { useRef, useEffect, DependencyList } from 'react';
import * as d3 from 'd3';

export type D3RenderFunction<T extends SVGElement = SVGSVGElement> = (
  selection: d3.Selection<T, unknown, null, undefined>
) => void;

/**
 * Custom React Hook for D3.js chart rendering.
 * Encapsulates DOM selection, rendering logic, and lifecycle cleanup.
 */
export function useD3<T extends SVGElement = SVGSVGElement>(
  renderChartFn: D3RenderFunction<T>,
  dependencies: DependencyList
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      const selection = d3.select(ref.current);
      renderChartFn(selection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}
