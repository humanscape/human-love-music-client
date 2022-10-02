import { Col, Layout, Menu, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { animated, useSpring, config } from 'react-spring';
import './AppHeader.less';

const GENRES = [
  'rock',
  'dnb',
  'house',
  'electronica',
  'techno',
  'trance',
  'chill-out',
  'metal',
  'music',
  'jazz',
  'blues',
  'hiphop',
  'punk',
  'k-pop',
  'j-pop',
  'trip-hop',
];
const height = 64;

const AppHeader: FC = () => {
  const getNextTargetGenreIndex = () =>
    Math.floor(Math.random() * GENRES.length);
  const [genre, setGenre] = useState({
    targetIndex: getNextTargetGenreIndex(),
    list: GENRES,
  });

  const mapPathnameToKey = (pathname: string) => pathname.split('/')[1] ?? '';
  const { pathname } = useLocation();

  const [{ scroll }, scrollAnimation] = useSpring(
    {
      scroll: genre.targetIndex * height,
      from: { scroll: 0 },
      config: config.molasses,
    },
    [pathname],
  );
  useEffect(() => {
    scrollAnimation.start({ reset: true });
    setGenre((prev) => {
      const nextList = prev.list
        .slice(prev.targetIndex)
        .concat(prev.list.slice(0, prev.targetIndex));
      return {
        targetIndex: getNextTargetGenreIndex(),
        list: nextList,
      };
    });
  }, [pathname]);

  return (
    <Layout.Header className="appHeader">
      <div className="appHeaderContainer">
        <div className="appHeaderTitle">
          <Link to="/">
            <Row gutter={2}>
              <Col>human</Col>
              <Col>💚</Col>
              <Col>
                <animated.div
                  scrollTop={scroll}
                  style={{ height, overflow: 'hidden' }}
                >
                  {genre.list.map((genre) => (
                    <div key={genre} style={{ height }}>
                      {genre}
                    </div>
                  ))}
                </animated.div>
              </Col>
            </Row>
          </Link>
        </div>
        <Menu
          className="appHeaderMenu"
          mode="horizontal"
          style={{ lineHeight: `${height}px` }}
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
