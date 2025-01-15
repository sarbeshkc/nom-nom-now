// src/types/google.d.ts

interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId: string;
  }
  
  interface Google {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: CredentialResponse) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            type?: 'standard' | 'icon';
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            width?: number;
          }
        ) => void;
        prompt: () => void;
      };
    };
  }
  
  declare global {
    interface Window {
      google?: Google;
    }
  }
  
  export {};