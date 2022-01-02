import { FC } from 'react';
import { RadioContainer } from '../containers';
import './RadioPage.less';

const RadioPage: FC = () => {
  return (
    <div className="radioPageContainer">
      <RadioContainer roomName="main" />
    </div>
  );
};

export default RadioPage;
