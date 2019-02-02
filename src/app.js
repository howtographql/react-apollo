import { action, observable } from 'mobx';
import { observer } from 'mobx-react'
import React from 'react'

const form_info = observable({
  fname:  ''
})

const cur_page = observable.box(1)

@observer
export class App extends React.Component {
  render() {
    const pages = [
        Page1,
        Page2,
    ]
    console.log("cur_page.get() = ", cur_page.get())
    return <div>
      <h1>
        Price Guide by HEP
      </h1>
      {React.createElement(pages[cur_page.get() - 1])}
    </div>
  }
}

export class Page1 extends React.Component {
  render() {
    return <div>
      <h2>Hello, may we ask your first name?</h2>
      <input value={form_info.fname} onChange={handleChange('fname')} required />
      <br />
      <button onClick={nextPage}>Next</button>
    </div>
  }
}

export class Page2 extends React.Component {
  render() {
    return <div>
      <h2>Hello, may we ask your first name?</h2>
      <input value={form_info.fname} onChange={handleChange('fname')} required />
      <br />
      <button onClick={nextPage}>Next</button>
    </div>
  }
}

function handleChange(field) {
  return e => {
    form_info[field] = e.target.value
  }
}

function nextPage() {
  cur_page.set(cur_page.get()+1)
}

function prevPage() {
  cur_page.set(cur_page.get()-1)
}
