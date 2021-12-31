import { YoutubeFilled } from '@ant-design/icons';
import { createElement } from 'react';
import { SoundCloudIcon } from '../icons';
import { TrackSourceProvider } from '../types';

export const trackSourceProviderMap = {
  [TrackSourceProvider.YOUTUBE]: {
    name: 'YouTube',
    icon: createElement(YoutubeFilled),
    defaultTrackUrl: process.env.REACT_APP_DEFAULT_YT_TRACK_URL as string,
  },
  [TrackSourceProvider.SOUNDCLOUD]: {
    name: 'SoundCloud',
    icon: createElement(SoundCloudIcon),
    defaultTrackUrl: process.env.REACT_APP_DEFAULT_SC_TRACK_URL as string,
  },
};
