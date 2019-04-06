// App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { About } from './pages/About';
import { Todo } from './pages/Todo';
import { SignUp } from "./pages/SignUp";
import { SignIn } from './pages/SignIn';


function App() {
  return <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {/* <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li> */}
          <li>
            <Link to="/todo">Todo</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      </nav>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
      <Route path="/users" component={Users} />
      <Route path="/todo" component={Todo} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
    </div>
  </Router>
}

export default App;