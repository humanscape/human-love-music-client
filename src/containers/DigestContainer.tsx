import { FC, useEffect, useState } from 'react';
import { api } from '../apis';
import { DigestResponse } from '../apis/dtos';
import { PlaylistHeader, PlaylistPlayButton } from '../components';

interface Props {
  id: string;
}

const DigestContainer: FC<Props> = ({ id }) => {
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  // TODO: fetch tracks

  useEffect(() => {
    const fetchDigest = async () => {
      const { data } = await api.digest.get(id);
      setDigest(data);
    };
    fetchDigest();
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
        trackCount={0}
      />
    </div>
  );
};

export default DigestContainer;
