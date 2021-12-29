import dayjs from 'dayjs';
import { FC, ReactElement } from 'react';
import { DigestResponse } from '../apis/dtos';
import './PlaylistHeader.less';

interface Props {
  digest: DigestResponse;
  playButton: ReactElement;
  trackCount?: number;
}

const PlaylistHeader: FC<Props> = ({ digest, playButton, trackCount }) => {
  const { title, description, createdAt } = digest;
  return (
    <div>
      <div className="playlistHeaderTitleSection">
        {playButton}
        <h1>{title}</h1>
      </div>
      <div className="playlistHeaderMetadata">
        <span>{dayjs(createdAt).fromNow()}</span>
        {trackCount != null && (
          <>
            <span>·</span>
            <span>{trackCount}개의 트랙</span>
          </>
        )}
      </div>
      <article className="playlistHeaderDescription">{description}</article>
    </div>
  );
};

export default PlaylistHeader;
