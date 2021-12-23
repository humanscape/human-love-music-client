import { Layout, Menu } from 'antd';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AppHeader.less';

const AppHeader: FC = () => {
  const mapPathnameToKey = (pathname: string) => pathname.split('/')[1] ?? '';
  const { pathname } = useLocation();
  return (
    <Layout.Header className="appHeader">
      <div className="appHeaderContainer">
        <div className="appHeaderTitle">
          <Link to="/">human💚music</Link>
        </div>
        <Menu
          className="appHeaderMenu"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          disabledOverflow={true}
          selectedKeys={[mapPathnameToKey(pathname)]}
        >
          {['radio', 'digest', 'console'].map((name) => (
            <Menu.Item key={name}>
              <Link to={name}>{name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </Layout.Header>
  );
};

export default AppHeader;
