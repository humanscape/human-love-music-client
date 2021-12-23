import { Layout } from 'antd';
import { FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AppHeader, PlayerControls } from './components';
import { ConsolePage, DigestListPage, DigestPage, RadioPage } from './pages';
import './App.less';

const App: FC = () => (
  <Layout>
    <AppHeader />
    <Layout.Content className="appContent">
      <div className="appContainer">
        <Routes>
          <Route path="/" element={<Navigate replace to="radio" />} />
          <Route path="radio" element={<RadioPage />} />
          <Route path="digest" element={<DigestListPage />} />
          <Route path="digest/:id" element={<DigestPage />} />
          <Route path="console" element={<ConsolePage />} />
        </Routes>
      </div>
    </Layout.Content>
    <PlayerControls />
  </Layout>
);

export default App;
