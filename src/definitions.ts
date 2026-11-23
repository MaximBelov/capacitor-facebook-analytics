import type { FacebookEventName, FacebookEventParameterName } from './event';

/**
 * Values accepted by the native Facebook App Events SDKs.
 *
 * Boolean values are converted to Facebook toggle strings: `true` becomes `"1"`
 * and `false` becomes `"0"`.
 */
export type FacebookEventParamValue = string | number | boolean | null;

/**
 * Event parameters keyed by Facebook standard parameter names or custom names.
 */
export type FacebookEventParams = Record<FacebookEventParameterName | string, FacebookEventParamValue>;

export interface LogEventOptions {
  /**
   * Facebook standard event name or a custom app event name.
   *
   * @example FacebookEventName.CompletedRegistration
   * @example "fb_mobile_complete_registration"
   */
  event: FacebookEventName | string;

  /**
   * Optional numeric value to sum for this event.
   */
  valueToSum?: number;

  /**
   * Optional ISO 4217 currency code for value-bearing standard events.
   *
   * This is forwarded as Facebook's `fb_currency` event parameter.
   *
   * @example "USD"
   * @example "EUR"
   */
  currency?: string;

  /**
   * Optional event parameters.
   */
  params?: FacebookEventParams;
}

export interface LogPurchaseOptions {
  /**
   * Purchase amount.
   */
  amount: number;

  /**
   * ISO 4217 currency code.
   *
   * @example "USD"
   * @example "EUR"
   */
  currency: string;

  /**
   * Optional purchase parameters.
   */
  params?: FacebookEventParams;
}

export interface AdvertiserTrackingStatusResult {
  /**
   * Current advertiser tracking status.
   */
  status: boolean;
}

export interface PluginVersionResult {
  /**
   * Version identifier returned by the platform implementation.
   */
  version: string;
}

export interface SetEnabledOptions {
  /**
   * `true` to switch the setting on, `false` to switch it off.
   */
  enabled: boolean;
}

/**
 * Facebook App Events analytics bridge.
 */
export interface FacebookAnalyticsPlugin {
  /**
   * Initialize the Facebook SDK and activate App Events.
   *
   * Call this when automatic app event logging is disabled and you want to
   * start sending events after your consent / ATT flow.
   *
   * On iOS this initializes FBSDK on the main thread, then activates App
   * Events.
   *
   * On Android, `FacebookInitProvider` normally runs basic SDK setup via
   * `FacebookSdk.sdkInitialize()` at app start. `com.facebook.sdk.AutoInitEnabled`
   * controls whether that path also calls `FacebookSdk.fullyInitialize()`
   * (server communication). `com.facebook.sdk.AutoLogAppEventsEnabled`
   * controls automatic `activateApp()` logging. When the provider was removed
   * (for example by `@capgo/capacitor-social-login`) or basic init never
   * completed, this method calls `sdkInitialize()` and waits for its
   * `InitializeCallback`, then enables full initialization via
   * `setAutoInitEnabled(true)` before calling `activateApp()`.
   * `activateApp()` alone is not enough when the SDK was never
   * initialized or only basic initialization completed.
   *
   * Do not initialize Facebook from `AppDelegate` for consent-gated apps;
   * call this method after the user grants advertising measurement consent.
   */
  initAppEvents(): Promise<void>;

  /**
   * Log a Facebook App Event.
   */
  logEvent(options: LogEventOptions): Promise<void>;

  /**
   * Log a Facebook purchase event.
   */
  logPurchase(options: LogPurchaseOptions): Promise<void>;

  /**
   * Enable advertiser tracking.
   *
   * On iOS 16 and below this sets `Settings.shared.isAdvertiserTrackingEnabled`.
   * On iOS 17 and above FBSDK v17+ reads App Tracking Transparency directly.
   * On Android this enables advertiser ID collection.
   */
  enableAdvertiserTracking(): Promise<void>;

  /**
   * Disable advertiser tracking.
   *
   * On iOS 16 and below this sets `Settings.shared.isAdvertiserTrackingEnabled`.
   * On iOS 17 and above FBSDK v17+ reads App Tracking Transparency directly.
   * On Android this disables advertiser ID collection.
   */
  disableAdvertiserTracking(): Promise<void>;

  /**
   * Get the current advertiser tracking status.
   *
   * On iOS 17 and above this reflects App Tracking Transparency authorization.
   */
  getAdvertiserTrackingStatus(): Promise<AdvertiserTrackingStatusResult>;

  /**
   * Allow or stop the SDK's automatic initialization.
   *
   * On Android this calls `FacebookSdk.setAutoInitEnabled()`. The SDK stores the
   * value, so it overrides `com.facebook.sdk.AutoInitEnabled` on later launches.
   * `true` fully initializes the SDK now (server communication starts) without
   * logging an app activation; `false` takes effect from the next launch, because
   * a fully initialized SDK cannot be shut down in the running process.
   *
   * On iOS the plugin never initializes the SDK by itself, so `true` initializes
   * it now (`ApplicationDelegate.shared.initializeSDK()`, no activation) and
   * `false` has nothing to switch off. Call it on every launch where
   * initialization is allowed.
   *
   * Use it to withdraw consent: unlike `initAppEvents()`, it can be called with
   * `false`.
   */
  setAutoInitEnabled(options: SetEnabledOptions): Promise<void>;

  /**
   * Allow or stop the app events the SDK logs by itself (app install and app
   * activation).
   *
   * Sets `FacebookSdk.setAutoLogAppEventsEnabled()` on Android and
   * `Settings.shared.isAutoLogAppEventsEnabled` on iOS. Both SDKs store the value,
   * so it overrides `com.facebook.sdk.AutoLogAppEventsEnabled` /
   * `FacebookAutoLogAppEventsEnabled` on later launches.
   */
  setAutoLogAppEventsEnabled(options: SetEnabledOptions): Promise<void>;

  /**
   * Allow or stop collection of the advertising identifier (the Google
   * advertising ID on Android, the IDFA on iOS).
   *
   * Sets `FacebookSdk.setAdvertiserIDCollectionEnabled()` on Android and
   * `Settings.shared.isAdvertiserIDCollectionEnabled` on iOS. Both SDKs store the
   * value. On Android this is the same switch `enableAdvertiserTracking()` and
   * `disableAdvertiserTracking()` set; on iOS it is separate from advertiser
   * tracking, which iOS 17 and above read from App Tracking Transparency.
   */
  setAdvertiserIDCollectionEnabled(options: SetEnabledOptions): Promise<void>;

  /**
   * Returns the platform implementation version marker.
   */
  getPluginVersion(): Promise<PluginVersionResult>;
}
