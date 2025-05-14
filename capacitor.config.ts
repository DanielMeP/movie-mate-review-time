
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fde1afce862b403486de14556916d3ea',
  appName: 'movie-mate-review-time',
  webDir: 'dist',
  server: {
    url: "https://fde1afce-862b-4034-86de-14556916d3ea.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
