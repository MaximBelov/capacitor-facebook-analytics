import { WebPlugin } from '@capacitor/core';

import type { AdvertiserTrackingStatusResult, FacebookAnalyticsPlugin, PluginVersionResult } from './definitions';

export class FacebookAnalyticsWeb extends WebPlugin implements FacebookAnalyticsPlugin {
  private advertiserTrackingEnabled = true;

  async initAppEvents(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async logEvent(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async logPurchase(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async enableAdvertiserTracking(): Promise<void> {
    this.advertiserTrackingEnabled = true;
  }

  async disableAdvertiserTracking(): Promise<void> {
    this.advertiserTrackingEnabled = false;
  }

  async getAdvertiserTrackingStatus(): Promise<AdvertiserTrackingStatusResult> {
    return {
      status: this.advertiserTrackingEnabled,
    };
  }

  async setAutoInitEnabled(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async setAutoLogAppEventsEnabled(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async setAdvertiserIDCollectionEnabled(): Promise<void> {
    throw this.unimplemented('Facebook Analytics is not available on web.');
  }

  async getPluginVersion(): Promise<PluginVersionResult> {
    return {
      version: 'web',
    };
  }
}
