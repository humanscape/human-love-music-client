import {
  CaretRightFilled,
  PauseOutlined,
  SoundOutlined,
  StepBackwardFilled,
  StepForwardFilled,
} from '@ant-design/icons';
import { Button, Col, Layout, Row, Slider, Space, Typography } from 'antd';
import { FC, useRef, useState } from 'react';
import { TrackResponse } from '../apis/dtos';
import { secondsToString } from '../utils/string';
import './PlayerControls.less';

interface Props {
  isPlaying: boolean;
  track: TrackResponse | null;
  controls?: {
    onPlay: () => void;
    onPause: () => void;
    onPlayNext: () => void;
    onPlayPrev: () => void;
    onSeekTo: (seconds: number) => void;
  };
  volume: {
    value: number;
    onChange: (value: number) => void;
  };
  duration: number | null;
  playedSeconds: number | null;
}

interface SeekBarState {
  value: number;
  dragging: boolean;
}

const PlayerControls: FC<Props> = ({
  isPlaying,
  track,
  controls,
  volume,
  duration,
  playedSeconds,
}) => {
  const [seekBarState, setSeekBarState] = useState<SeekBarState>({
    value: 0,
    dragging: false,
  });
  // FIXME: could not found type def of Slider ref
  const seekBar = useRef<any>(null);

  const handleSeekBarChange = (value: number) => {
    setSeekBarState({ value, dragging: true });
  };
  const handleSeekBarAfterChange = (value: number) => {
    controls?.onSeekTo(seekBarState.value);
    setSeekBarState((state) => ({ value: state.value, dragging: false }));
    seekBar.current.blur();
  };

  return (
    <Layout.Footer>
      <Slider
        className="playerControlsSeekBar"
        ref={seekBar}
        disabled={!track}
        max={(track && duration) ?? Number.MAX_SAFE_INTEGER}
        value={
          seekBarState.dragging
            ? seekBarState.value
            : (track && playedSeconds) ?? 0
        }
        onChange={handleSeekBarChange}
        onAfterChange={handleSeekBarAfterChange}
        tipFormatter={(value) =>
          value != null ? secondsToString(value) : undefined
        }
      />
      <div className="playerControlsContainer">
        <Row align="middle" style={{ width: '100%' }}>
          <Col span={4}>
            {controls && (
              <div className="playerControlsLeft">
                <Space>
                  <Button
                    icon={<StepBackwardFilled />}
                    type="text"
                    size="large"
                    disabled={!track}
                    onClick={controls.onPlayPrev}
                  />
                  <Button
                    icon={isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
                    shape="circle"
                    size="large"
                    disabled={!track}
                    onClick={() =>
                      isPlaying ? controls.onPause() : controls.onPlay()
                    }
                  />
                  <Button
                    icon={<StepForwardFilled />}
                    size="large"
                    type="text"
                    disabled={!track}
                    onClick={controls.onPlayNext}
                  />
                </Space>
              </div>
            )}
          </Col>
          <Col span={16} style={{ textAlign: 'center', maxHeight: 40 }}>
            {track && (
              <Space direction="vertical" size={0}>
                <Typography.Link
                  href={track.sourceUrl}
                  target="_blank"
                  style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                >
                  {track.title}
                </Typography.Link>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {track.author}
                </Typography.Text>
              </Space>
            )}
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <div className="playerControlsVolume">
              <SoundOutlined />
              <Slider
                value={volume.value}
                tooltipVisible={false}
                onChange={volume.onChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Layout.Footer>
  );
};

export default PlayerControls;
