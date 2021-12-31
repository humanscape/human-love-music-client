import { List, Space, Typography } from 'antd';
import { FC, ReactNode } from 'react';
import { TrackResponse } from '../apis/dtos';
import { trackSourceProviderMap } from '../constants';

interface Props {
  tracks: TrackResponse[];
  onClickTitle: (track: TrackResponse) => void;
  emptyPlaceholder?: ReactNode;
}

const Tracklist: FC<Props> = ({ tracks, onClickTitle, emptyPlaceholder }) => {
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={tracks}
      locale={{ emptyText: emptyPlaceholder }}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          style={{ borderLeft: '1px solid #d9d9d9', paddingLeft: '8px' }}
          actions={[
            <Space>
              {trackSourceProviderMap[item.sourceProvider].icon}
              <Typography.Link
                href={item.sourceUrl}
                target="_blank"
                style={{ color: 'rgba(255, 255, 255, 0.45)' }}
              >
                {trackSourceProviderMap[item.sourceProvider].name}
              </Typography.Link>
            </Space>,
          ]}
        >
          <List.Item.Meta
            title={
              <Typography.Link ellipsis onClick={() => onClickTitle(item)}>
                {item.title}
              </Typography.Link>
            }
            description={item.author}
          />
          {item.body}
        </List.Item>
      )}
    />
  );
};

export default Tracklist;
