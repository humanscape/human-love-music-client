import { FC } from 'react';
import { useParams } from 'react-router-dom';

const DigestPage: FC = () => {
  const { id } = useParams();
  return <div>digest page of {id}</div>;
};

export default DigestPage;
