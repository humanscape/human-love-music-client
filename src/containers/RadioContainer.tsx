import { Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import { api } from '../apis';
import { RadioResponse, RadioTrackResponse, TrackResponse } from '../apis/dtos';
import {
  PlayerControls,
  PlaylistHeader,
  PlaylistPlayButton,
  Tracklist,
} from '../components';
import { trackSourceProviderMap } from '../constants';
import { usePlayer } from '../hooks';
import { TrackSourceProvider } from '../types';

const socket = io(`${process.env.REACT_APP_API_BASE_URL}/radios/main`, {
  transports: ['websocket'],
});

// TODO: debugging purpose only
const disableNativeControl = false;

interface Props {
  roomName: string;
}

const RadioContainer: FC<Props> = ({ roomName }) => {
  const [radio, setRadio] = useState<RadioResponse | null>(null);
  const [tracks, setTracks] = useState<RadioTrackResponse[]>([]);
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
  } = usePlayer();

  const youtubePlayer = useRef<ReactPlayer | null>(null);
  const soundcloudPlayer = useRef<ReactPlayer | null>(null);
  const playerRefMap = {
    [TrackSourceProvider.YOUTUBE]: youtubePlayer,
    [TrackSourceProvider.SOUNDCLOUD]: soundcloudPlayer,
  };

  const updateRadio = async () => {
    const [radioRes, tracksRes] = await Promise.all([
      api.radio.get(roomName),
      api.radio.getTracks(roomName),
    ]);
    setRadio(radioRes.data);
    setTracks(tracksRes.data);
  };

  // register socket events
  useEffect(() => {
    socket.on('track-added', async () => {
      console.log('@track added');
      await updateRadio();
    });
    // 스케쥴러에 의해 다음 재생할 곡이 있을 때 호출됨
    // 서버는 이거 던지기 전에 radio, tracks를 이미 업데이트한 상태
    socket.on('play-next', async () => {
      console.log('@play next');
      await updateRadio();
    });
  }, []);

  useEffect(() => {
    const fetchDigest = async () => {
      const { data } = await api.radio.get(roomName);
      setRadio(data);
    };
    fetchDigest();
  }, [roomName]);
  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await api.radio.getTracks(roomName);
      setTracks(data);
    };
    fetchTracks();
  }, [roomName]);

  // 최초 접속시, 곡이 인큐 될 때, 다음곡 넘어갈 때 트리거됨
  // 곡이 인큐될 때는 playCurrentTrack 내부에서 필터링하여 동작 생략
  useEffect(() => {
    playCurrentTrack();
  }, [radio, tracks]);

  const handleReady = (provider: TrackSourceProvider) => {
    if (player[provider].track) {
      setLoading(false);
      play(provider); // autoplay
      const secondsPassed = dayjs().diff(radio?.currentTrack?.startedAt, 's');
      playerRefMap[provider].current?.seekTo(secondsPassed);
    }
    init(provider);
    setRef(provider, playerRefMap[provider].current);
  };

  const playCurrentTrack = () => {
    // 이 시점에서 새로 조회 안해도 이미 radio, tracks는 이벤트에 의해 최신상태
    const currentTrack = radio?.currentTrack;
    if (!currentTrack) {
      return;
    }
    if (
      currentProvider &&
      currentTrack.id === player[currentProvider].track?.id
    ) {
      return;
    }
    const track = tracks.find((it) => it.id === currentTrack.id);
    if (!track) {
      return;
    }
    const target = track.sourceProvider;
    stopOthers(target);
    setTrack(target, track);
  };

  if (!radio) {
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
              onPlay={() => tracks.length > 0 && playCurrentTrack()}
              onResume={() => currentProvider && play(currentProvider)}
            />
          }
          digest={radio}
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
          {!currentProvider && tracks.length ? (
            <Space
              align="center"
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <div>재생 버튼을 눌러주세요</div>
            </Space>
          ) : null}
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
                onDuration={(duration) => setDuration(provider, duration)}
                onProgress={({ played, playedSeconds }) =>
                  player[provider].status.playing &&
                  updateProgress(provider, played, playedSeconds)
                }
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
            currentTrack?.id !== track.id &&
            alert('라디오 모드에서 음악은 차례대로 재생됩니다')
          }
          emptyPlaceholder={'💊 음악을 멈추게하지 마세요'}
        />
      </div>
      <PlayerControls
        isPlaying={isPlaying}
        track={currentTrack}
        duration={currentProvider && player[currentProvider].status.duration}
        playedSeconds={
          currentProvider && player[currentProvider].status.playedSeconds
        }
      />
    </>
  );
};

export default RadioContainer;
