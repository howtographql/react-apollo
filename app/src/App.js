// App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { About } from './pages/About';
import { Todo } from './pages/Todo';


function App() {
  return <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/todo">Todo</Link>
          </li>
        </ul>
      </nav>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
      <Route path="/users" exact component={Users} />
      <Route path="/todo" exact component={Todo} />
    </div>
  </Router>
}

export default App;