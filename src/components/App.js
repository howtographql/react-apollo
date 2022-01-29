import React from 'react';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './Login';
import Search from './Search';

const App = () => (
  <div className="center w85">
    <Header />
    <div className="ph3 pv1 background-gray">
      <Routes>
        <Route
          path="/"
          element={<Navigate replace to="/new/1" />}
        />
        <Route
          path="/create"
          element={<CreateLink/>}
        />
        <Route path="/login" element={<Login/>}/>
        <Route path="/search"element={<Search/>}/>
        <Route path="/top" element={<LinkList/>} />
        <Route
          path="/new/:page"
          element={<LinkList/>}
        />
      </Routes>
    </div>
  </div>
);

export default App;
