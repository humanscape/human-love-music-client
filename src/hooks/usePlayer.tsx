import ReactPlayer from 'react-player';
import { useImmer } from 'use-immer';
import { TrackResponse } from '../apis/dtos';
import { TrackSourceProvider } from '../types';

interface PlayerState {
  player: {
    [key in TrackSourceProvider]: {
      ref: ReactPlayer | null;
      track: TrackResponse | null;
      status: {
        playing: boolean;
        duration: number;
        playedRatio: number;
        playedSeconds: number;
      };
    };
  };
  currentProvider: TrackSourceProvider | null;
  loading: boolean;
}

interface PlayActions {
  init: (provider: TrackSourceProvider) => void;
  setRef: (provider: TrackSourceProvider, ref: ReactPlayer | null) => void;
  setTrack: (
    provider: TrackSourceProvider,
    track: TrackResponse | null,
  ) => void;
  play: (provider: TrackSourceProvider) => void;
  pause: (provider: TrackSourceProvider) => void;
  stop: (provider: TrackSourceProvider) => void;
  stopOthers: (provider: TrackSourceProvider) => void;
  setLoading: (loading: boolean) => void;
}

export interface PlayerHookProps extends PlayerState, PlayActions {}

export const usePlayer = (): PlayerHookProps => {
  const initialProviderState = {
    ref: null,
    track: null,
    status: {
      playing: false,
      duration: 0,
      playedRatio: 0,
      playedSeconds: 0,
    },
  };
  const [playerState, setPlayerState] = useImmer<PlayerState>({
    player: {
      [TrackSourceProvider.YOUTUBE]: initialProviderState,
      [TrackSourceProvider.SOUNDCLOUD]: initialProviderState,
    },
    currentProvider: null,
    loading: false,
  });

  const stop = (provider: TrackSourceProvider) => {
    setPlayerState((draft) => {
      draft.player[provider].track = null;
      draft.player[provider].status = {
        playing: false,
        duration: 0,
        playedRatio: 0,
        playedSeconds: 0,
      };
    });
  };
  return {
    ...playerState,
    init: (provider: TrackSourceProvider) => {
      setPlayerState((draft) => {
        draft.player[provider].status.playedRatio = 0;
        draft.player[provider].status.playedSeconds = 0;
      });
    },
    setRef: (provider: TrackSourceProvider, ref: any | null) => {
      setPlayerState((draft) => {
        draft.player[provider].ref = ref;
      });
    },
    setTrack: (provider: TrackSourceProvider, track: TrackResponse | null) => {
      setPlayerState((draft) => {
        draft.loading = true;
        draft.currentProvider = provider;
        draft.player[provider].track = track;
        draft.player[provider].status.playedRatio = 0;
        draft.player[provider].status.playedSeconds = 0;
      });
    },
    play: (provider: TrackSourceProvider) => {
      setPlayerState((draft) => {
        draft.player[provider].status.playing = true;
      });
    },
    pause: (provider: TrackSourceProvider) => {
      setPlayerState((draft) => {
        draft.player[provider].status.playing = false;
      });
    },
    stop,
    stopOthers: (provider: TrackSourceProvider) => {
      Object.keys(TrackSourceProvider).forEach((key) => {
        if (key !== provider) {
          stop(key as TrackSourceProvider);
        }
      });
    },
    setLoading: (loading: boolean) => {
      setPlayerState((draft) => {
        draft.loading = loading;
      });
    },
  };
};