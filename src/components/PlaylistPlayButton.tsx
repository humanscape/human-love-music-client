import { Button } from 'antd';
import { CaretRightFilled } from '@ant-design/icons';
import { FC } from 'react';

interface Props {
  isPlaying: boolean;
  hasCurrent: boolean;
  onPause: () => void;
  onPlay: () => void;
  onResume: () => void;
}

const PlaylistPlayButton: FC<Props> = ({
  isPlaying,
  hasCurrent,
  onPause,
  onPlay,
  onResume,
}) => {
  const button = isPlaying ? (
    <Button icon="pause" shape="circle" onClick={() => onPause()} />
  ) : (
    <Button
      icon={<CaretRightFilled />}
      type="primary"
      shape="circle"
      onClick={() => (hasCurrent ? onResume() : onPlay())}
    />
  );
  return button;
};

export default PlaylistPlayButton;
