import { Button, List } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../apis';
import { DigestResponse } from '../apis/dtos';

const DigestsContainer: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [total, setTotal] = useState<number | null>(null);
  const [digests, setDigests] = useState<DigestResponse[]>([]);

  useEffect(() => {
    const fetchDigests = async () => {
      setLoading(true);
      const { data } = await api.digest.getMany(pagination);
      setDigests((digests) => [...digests, ...data.data]);
      setTotal(data.total);
      setLoading(false);
    };
    fetchDigests();
  }, [pagination]);

  const onLoadMore = () => {
    setPagination((pagination) => ({
      page: pagination.page + 1,
      size: pagination.size,
    }));
  };

  const hasMore = total && total > digests.length;
  const loadMore =
    !isLoading && hasMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>more</Button>
      </div>
    ) : null;

  return (
    <List
      itemLayout="horizontal"
      loading={isLoading}
      dataSource={digests}
      loadMore={loadMore}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={<Link to={`/digest/${item.id}`}>{item.title}</Link>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default DigestsContainer;
