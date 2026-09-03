import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.agatigito.app",
  appName: "Agatigito",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
