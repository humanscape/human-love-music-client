import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { DigestContainer } from '../containers';
import './DigestPage.less';

const DigestPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="digestPageContainer">
      <DigestContainer id={id!} />
    </div>
  );
};

export default DigestPage;
