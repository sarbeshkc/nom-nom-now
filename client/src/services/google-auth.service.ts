// src/services/google-auth.service.ts

class GoogleAuthService {
  private clientId: string;
  private currentOrigin: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // Get the current origin dynamically
    this.currentOrigin = window.location.origin;
    
    if (!this.clientId) {
      console.error('Google Client ID is not configured');
    }
    
    // Log the current origin to help with debugging
    console.log('Current origin:', this.currentOrigin);
  }

  async signIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.clientId) {
        reject(new Error('Google Client ID is not configured'));
        return;
      }

      const loadScript = () => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initializeGoogle(resolve, reject);
        };
        script.onerror = (error) => {
          console.error('Failed to load Google Sign-In script:', error);
          reject(new Error('Failed to load Google Sign-In'));
        };
        document.head.appendChild(script);
      };

      // Check if Google client is already loaded
      if (window.google?.accounts) {
        this.initializeGoogle(resolve, reject);
      } else {
        loadScript();
      }
    });
  }

  private initializeGoogle(resolve: (value: any) => void, reject: (reason: any) => void) {
    try {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          if (response.credential) {
            resolve(response);
          } else {
            reject(new Error('No credentials received'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signup' // Specify the context
      });

      // Render the button
      const buttonContainer = document.getElementById('googleButton');
      if (buttonContainer) {
        // Clear existing content
        buttonContainer.innerHTML = '';
        
        window.google.accounts.id.renderButton(
          buttonContainer,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: 250,
            locale: 'en'
          }
        );
      } else {
        console.error('Google button container not found');
      }

      // Handle One Tap UI
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log(`One Tap UI not displayed: ${notification.getNotDisplayedReason()}`);
        } else if (notification.isSkippedMoment()) {
          console.log(`One Tap UI skipped: ${notification.getSkippedReason()}`);
        } else if (notification.isDismissedMoment()) {
          console.log(`One Tap UI dismissed: ${notification.getDismissedReason()}`);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      reject(error);
    }
  }
}

export const googleAuthService = new GoogleAuthService();