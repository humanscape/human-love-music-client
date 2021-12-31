import { Divider } from 'antd';
import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { api } from '../apis';
import {
  DigestResponse,
  DigestTrackResponse,
  TrackResponse,
} from '../apis/dtos';
import { PlaylistHeader, PlaylistPlayButton, Tracklist } from '../components';
import { trackSourceProviderMap } from '../constants';
import { usePlayer } from '../hooks';
import { TrackSourceProvider } from '../types';

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
    setLoading,
    setTrack,
    play,
    pause,
    stopOthers,
  } = usePlayer();

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

  if (!digest) {
    return <div />;
  }
  return (
    <div>
      <PlaylistHeader
        playButton={
          <PlaylistPlayButton
            isPlaying={
              currentProvider ? player[currentProvider].status.playing : false
            }
            hasCurrent={!!currentProvider}
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
          disableNativeControl && alert('TODO: block controls or pause/resume')
        }
        style={{ height: '544px' }}
      >
        {(Object.keys(trackSourceProviderMap) as TrackSourceProvider[]).map(
          (provider) => (
            <ReactPlayer
              // @see https://www.aleksandrhovhannisyan.com/blog/react-iframes-back-navigation-bug
              key={`${provider}-${player[provider].track?.id ?? 'default'}`}
              url={
                player[provider].track?.sourceUrl ??
                trackSourceProviderMap[provider].defaultTrackUrl
              }
              playing={player[provider].status.playing}
              onReady={() => handleReady(provider)}
              onPlay={() => play(provider)}
              onPause={() => pause(provider)}
              onEnded={() => playNext(provider)}
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
        onClickTitle={playTrack}
        emptyPlaceholder={'😝 아무것도 없어요'}
      />
    </div>
  );
};

export default DigestContainer;
