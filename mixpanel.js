import mixpanel from 'mixpanel-browser';

mixpanel.init('ee6c842625eb83d4d649ddb3d8567c96', {
  debug: process.env.NODE_ENV !== 'production',
  track_pageview: true,
  persistence: 'localStorage'
});

export const Mixpanel = {
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  identify: (id) => {
    mixpanel.identify(id);
  },
  // Add other Mixpanel methods as needed
};