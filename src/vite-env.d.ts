/// <reference types="vite/client" />

declare module 'scrollama' {
  export interface ScrollamaCallbackResponse {
    element: HTMLElement;
    index: number;
    direction: 'up' | 'down';
  }

  export interface ScrollamaProgressResponse extends ScrollamaCallbackResponse {
    progress: number;
  }

  export interface ScrollamaSetupOptions {
    step: string | HTMLElement[] | NodeListOf<HTMLElement>;
    offset?: number | string;
    progress?: boolean;
    threshold?: number;
    order?: boolean;
    once?: boolean;
    debug?: boolean;
    parent?: HTMLElement;
    [key: string]: unknown;
  }

  export interface ScrollamaInstance {
    setup(options: ScrollamaSetupOptions): ScrollamaInstance;
    onStepEnter(callback: (response: ScrollamaCallbackResponse) => void): ScrollamaInstance;
    onStepExit(callback: (response: ScrollamaCallbackResponse) => void): ScrollamaInstance;
    onStepProgress(callback: (response: ScrollamaProgressResponse) => void): ScrollamaInstance;
    resize(): ScrollamaInstance;
    enable(): ScrollamaInstance;
    disable(): ScrollamaInstance;
    destroy(): ScrollamaInstance;
    offset(val?: number): number | ScrollamaInstance;
  }

  export default function scrollama(): ScrollamaInstance;
}
