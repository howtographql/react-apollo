import React from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Form } from './sample/form'

export function App() {
  return <div>
    <h1>
      Eggshell
    </h1>
    <Router>
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
              <Link to="/form">Form</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about" component={About} />
        <Route path="/form" component={FormPage} />
        
      </div>
    </Router>
  </div>
}

function Index() {
  return <h2>Home</h2>
}

function About() {
  return <h2>About</h2>
}

function FormPage() {
  return <>
    <h2>Form</h2>
    <Form />
    </>
}

