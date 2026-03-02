import analytics from '@react-native-firebase/analytics';

/**
 * Track a custom event in Google Analytics.
 * Works natively on iOS and Android using the native Firebase SDK.
 *
 * @param eventName - Name of the event (e.g. 'button_click', 'screen_view')
 * @param params - Optional parameters to attach to the event
 *
 * @example
 * trackEvent('open_list_button_click');
 * trackEvent('filter_selected', { category: 'cleaner' });
 */
export const trackEvent = async (
  eventName: string,
  params?: Record<string, string | number | boolean | null>
) => {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.error('Analytics logEvent error:', error);
  }
};

export { analytics };
