import { FC } from 'react';
import { DigestForm } from '../components';
import './ConsolePage.less';

const ConsolePage: FC = () => {
  return (
    <div className="consolePageContainer">
      <DigestForm />
    </div>
  );
};

export default ConsolePage;
