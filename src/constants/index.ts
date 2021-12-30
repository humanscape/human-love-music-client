import { YoutubeFilled } from '@ant-design/icons';
import { createElement } from 'react';
import { SoundCloudIcon } from '../icons';
import { TrackSourceProvider } from '../types';

export const trackSourceProviderMap = {
  [TrackSourceProvider.YOUTUBE]: {
    name: 'YouTube',
    icon: createElement(YoutubeFilled),
  },
  [TrackSourceProvider.SOUNDCLOUD]: {
    name: 'SoundCloud',
    icon: createElement(SoundCloudIcon),
  },
};
