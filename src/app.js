import { observer } from 'mobx-react'
import React from 'react';

@observer
export class App extends React.Component {

  render() {
    return <div>
      <h1>
        Title
      </h1>
    </div>
  }
}

export function renderInput(field) {
  return <input value={form_info[field]} onChange={handleChange(field)} required />
}

export function renderSelectField(options, fieldName) {
  return <select value={form_info[fieldName]} onChange={handleChange(fieldName)}>
    {
      options.map(opt => {
        return <option key={opt} value={opt}>{opt}</option>
      })
    }
  </select>
}

export function handleChange(field) {
  return e => {
    form_info[field] = e.target.value
  }
}

export function ifEl(arg, el) {
  if (arg) return el
  else return ''
}