import { Divider } from 'antd';
import { FC, useEffect, useState } from 'react';
import { api } from '../apis';
import { DigestResponse, DigestTrackResponse } from '../apis/dtos';
import { PlaylistHeader, PlaylistPlayButton, Tracklist } from '../components';

interface Props {
  id: string;
}

const DigestContainer: FC<Props> = ({ id }) => {
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  const [tracks, setTracks] = useState<DigestTrackResponse[]>([]);

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

  if (!digest) {
    return <div />;
  }
  return (
    <div>
      <PlaylistHeader
        playButton={
          <PlaylistPlayButton
            isPlaying={false}
            hasCurrent={false}
            onPlay={() => null}
            onPause={() => null}
            onResume={() => null}
          />
        }
        digest={digest}
        trackCount={tracks.length}
      />
      <Divider />
      <div>player goes here</div>
      <Divider />
      <Tracklist tracks={tracks} emptyPlaceholder={'😝 아무것도 없어요'} />
    </div>
  );
};

export default DigestContainer;
