import { Divider } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { api } from '../apis';
import {
  DigestResponse,
  DigestTrackResponse,
  TrackResponse,
} from '../apis/dtos';
import {
  PlayerControls,
  PlaylistHeader,
  PlaylistPlayButton,
  Tracklist,
} from '../components';
import { trackSourceProviderMap } from '../constants';
import { usePlayer } from '../hooks';
import { TrackSourceProvider } from '../types';
import { getInitialVolume } from '../utils/volume';

// TODO: debugging purpose only
const disableNativeControl = false;

interface Props {
  id: string;
}

const DigestContainer: FC<Props> = ({ id }) => {
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  const [tracks, setTracks] = useState<DigestTrackResponse[]>([]);
  const {
    player,
    currentProvider,
    loading,
    init,
    setRef,
    setLoading,
    setDuration,
    updateProgress,
    setTrack,
    play,
    pause,
    stopOthers,
    volume,
    changeVolume,
  } = usePlayer(getInitialVolume());

  const youtubePlayer = useRef<ReactPlayer | null>(null);
  const soundcloudPlayer = useRef<ReactPlayer | null>(null);
  const playerRefMap = {
    [TrackSourceProvider.YOUTUBE]: youtubePlayer,
    [TrackSourceProvider.SOUNDCLOUD]: soundcloudPlayer,
  };

  useEffect(() => {
    const fetchDigest = async () => {
      const { data } = await api.digest.get(id);
      setDigest(data);
    };
    fetchDigest();
  }, [id]);
  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await api.digest.getTracks(id);
      setTracks(data);
    };
    fetchTracks();
  }, [id]);

  const handleReady = (provider: TrackSourceProvider) => {
    if (player[provider].track) {
      setLoading(false);
      play(provider); // autoplay
    }
    init(provider);
    setRef(provider, playerRefMap[provider].current);
  };

  const playTrack = (track: TrackResponse) => {
    const target = track.sourceProvider;
    stopOthers(target);
    setTrack(target, track);
  };

  const playNext = (provider: TrackSourceProvider) => {
    const current = player[provider].track;
    if (!current) {
      return;
    }
    const currentIndex = tracks.findIndex((it) => it.id === current.id);
    if (currentIndex === -1) {
      return;
    }
    const next = tracks[currentIndex + 1];
    if (!next) {
      return;
    }
    playTrack(next);
  };

  const playPrev = (provider: TrackSourceProvider) => {
    const current = player[provider].track;
    if (!current) {
      return;
    }
    const currentIndex = tracks.findIndex((it) => it.id === current.id);
    if (currentIndex === -1) {
      return;
    }
    const prev = tracks[currentIndex - 1];
    if (!prev) {
      return;
    }
    playTrack(prev);
  };

  if (!digest) {
    return <div />;
  }

  const currentTrack = currentProvider ? player[currentProvider].track : null;
  const isPlaying = currentProvider
    ? player[currentProvider].status.playing
    : false;
  return (
    <>
      <div>
        <PlaylistHeader
          playButton={
            <PlaylistPlayButton
              isPlaying={isPlaying}
              hasCurrent={!!currentTrack}
              onPause={() => currentProvider && pause(currentProvider)}
              onPlay={() => tracks.length > 0 && playTrack(tracks[0])}
              onResume={() => currentProvider && play(currentProvider)}
            />
          }
          digest={digest}
          trackCount={tracks.length}
        />
        <Divider />
        <div
          onClick={() =>
            disableNativeControl &&
            alert('TODO: block controls or pause/resume')
          }
          style={{ height: '544px' }}
        >
          {(Object.keys(trackSourceProviderMap) as TrackSourceProvider[]).map(
            (provider) => (
              <ReactPlayer
                // @see https://www.aleksandrhovhannisyan.com/blog/react-iframes-back-navigation-bug
                key={`${provider}-${player[provider].track?.id ?? 'default'}`}
                ref={playerRefMap[provider]}
                url={
                  player[provider].track?.sourceUrl ??
                  trackSourceProviderMap[provider].defaultTrackUrl
                }
                playing={player[provider].status.playing}
                onReady={() => handleReady(provider)}
                onPlay={() => play(provider)}
                onPause={() => pause(provider)}
                onEnded={() => playNext(provider)}
                onDuration={(duration) => setDuration(provider, duration)}
                onProgress={({ played, playedSeconds }) =>
                  player[provider].status.playing &&
                  updateProgress(provider, played, playedSeconds)
                }
                volume={volume / 100}
                config={{
                  // https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5
                  youtube: {
                    playerVars: {
                      controls: disableNativeControl ? 0 : 1,
                      autoplay: 1,
                      iv_load_policy: 3,
                      rel: 0,
                    },
                  },
                  // https://developers.soundcloud.com/docs/api/html5-widget
                  soundcloud: {
                    options: {
                      single_active: false,
                      hide_related: true,
                      auto_play: true,
                    },
                  },
                }}
                width="100%"
                height="100%"
                style={{
                  pointerEvents: disableNativeControl ? 'none' : 'all',
                  display:
                    !loading && currentProvider === provider ? 'block' : 'none',
                }}
              />
            ),
          )}
        </div>
        <Divider />
        <Tracklist
          tracks={tracks}
          currentTrack={currentTrack}
          onClickTitle={(track: TrackResponse) =>
            currentTrack?.id !== track.id && playTrack(track)
          }
          emptyPlaceholder={'😝 아무것도 없어요'}
        />
      </div>
      <PlayerControls
        isPlaying={isPlaying}
        track={currentTrack}
        duration={currentProvider && player[currentProvider].status.duration}
        playedSeconds={
          currentProvider && player[currentProvider].status.playedSeconds
        }
        controls={{
          onPlay: () => currentProvider && play(currentProvider),
          onPause: () => currentProvider && pause(currentProvider),
          onPlayNext: () => currentProvider && playNext(currentProvider),
          onPlayPrev: () => currentProvider && playPrev(currentProvider),
          onSeekTo: (seconds: number) =>
            currentProvider &&
            playerRefMap[currentProvider].current?.seekTo(seconds),
        }}
        volume={{
          value: volume,
          onChange: changeVolume,
        }}
      />
    </>
  );
};

export default DigestContainer;
