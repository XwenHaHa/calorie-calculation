import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export async function initCapacitor() {
  if (!isNative()) return;

  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#eef2ef' });
  } catch (e) {
    console.warn('StatusBar setup failed:', e);
  }

  try {
    await SplashScreen.hide();
  } catch (e) {
    console.warn('SplashScreen hide failed:', e);
  }

  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });
}

export async function hapticImpact(style: ImpactStyle = ImpactStyle.Light) {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style });
  } catch {
    // Haptics not available
  }
}
