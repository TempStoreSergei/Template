declare module "vue" {
  interface HTMLAttributes {
    [key: string]: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-dialog': any;
      'md-circular-progress': any;
      'md-text-button': any;
      'md-filled-button': any;
      'md-icon-button': any;
      'md-icon': any;
      'md-chip': any;
      'md-filled-text-field': any;
    }
  }
} 