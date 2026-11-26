import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';
const config: CapacitorConfig = {
  appId: 'com.nexo.users', appName: 'Países'', webDir: 'dist',
  plugins: {
    SystemBars: { insetsHandling: 'native', initialViewportFitValueHint: 'cover', style: 'LIGHT' },
    CapacitorHttp: { enabled: true },
    Keyboard: { resize: KeyboardResize.Body, resizeOnFullScreen: true },
    SplashScreen: { launchAutoHide: true, launchShowDuration: 2000, backgroundColor: '#173e35', showSpinner: false },
  },
};
export default config;
