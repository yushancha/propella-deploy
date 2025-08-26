/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  const React: typeof import('react');
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  const ReactDOM: typeof import('react-dom');
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'next-auth/react' {
  export * from 'next-auth/react';
}

declare module 'next/navigation' {
  export * from 'next/navigation';
}

// Global type declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
