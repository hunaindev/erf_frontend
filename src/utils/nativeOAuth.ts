import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export const MOBILE_APP_SCHEME = "com.erfluencer.app";

export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

export const openOAuthUrl = async (url: string): Promise<void> => {
  if (!url) {
    return;
  }

  if (isNativeApp()) {
    await Browser.open({ url });
    return;
  }

  window.location.replace(url);
};

export const buildMobileOAuthCallbackUrl = (
  targetPath: string,
  params?: Record<string, string>,
): string => {
  const searchParams = new URLSearchParams({
    target: targetPath.startsWith("/") ? targetPath : `/${targetPath}`,
    ...(params ?? {}),
  });

  return `${MOBILE_APP_SCHEME}://oauth?${searchParams.toString()}`;
};

export const getAppRouteFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol.replace(":", "") !== MOBILE_APP_SCHEME) {
      return null;
    }

    const target = parsedUrl.searchParams.get("target");
    if (!target) {
      return null;
    }

    parsedUrl.searchParams.delete("target");

    const queryString = parsedUrl.searchParams.toString();
    return queryString ? `${target}?${queryString}` : target;
  } catch (error) {
    console.error("Failed to parse native OAuth callback URL", error);
    return null;
  }
};
