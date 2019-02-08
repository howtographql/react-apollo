import { action, observable } from 'mobx';
import { observer } from 'mobx-react'
import React from 'react'

const importance_factors = [
  'Saving Money',
  'Comfort',
  'Ease of Operation',
  'Easy Financing',
  'Indoor Air Quality',
  'Low Operating Cost',
  'Return on Investment',
  'Quiet Operation',
  'Efficiency',
  'Warranty',
  'Fast Installation',
  'System Longevity',
]

const form_info = observable({
  fname:  '',
  zip: '',
  service_needed: 'both',
  home_size: '',
  importance_factors: {},
  email: '',
})


const cur_page = observable.box(0)
const service_options = [
  'heating',
  'cooling',
  'both',
]
const home_sizes = [
  '600 - 950 sq. ft.',
  '951 - 1250 sq. ft.',
  '1251 - 1550 sq. ft.',
  '1551 - 1850 sq. ft.',
  '1851 - 2150 sq. ft.',
  '2151 - 2500 sq. ft.',
  '2501 - 3100 sq. ft.',
  '3101+ sq. ft.',
]

let pages;

@observer
export class App extends React.Component {
  render() {
    pages = [
    <Page>
      <h2>Hello.</h2>
      <h3>What's your first name?</h3>
      {renderInput('fname')}
      <br />
    </Page>,
    <Page>
      <h3>What's your zip code?</h3>
      <br />
      {renderInput('zip')}
      <br />
    </Page>,
    <Page>
      <h3>Do you need heating, cooling, or both today?</h3>
      {renderSelectField(service_options, 'service_needed')}
      <br />
    </Page>,
    <Page>
      <h3>What size is your home?</h3>
      {
        renderSelectField(home_sizes, 'home_size')
      }
    </Page>,
    <Page>
      <h3>What is the most important to you?</h3>
      {
        importance_factors.map(factor => {
          const factors = form_info.importance_factors
          return <div key={factor}>
            <input
              type="checkbox"
              checked={!!factors[factor]}
              onChange={_ => factors[factor] = !factors[factor]}
            /> {factor}
            <br />
          </div>
        })
      }
    </Page>,
    <Page>
      <h3>What's your email address?</h3>
      {renderInput('email')}
    </Page>

  ]
    return <div>
      <h1>
        Price Guide by HEP
      </h1>
      {pages[cur_page]}
    </div>

  }
}

@observer
export class Page extends React.Component {
  render() {
    return <div>
      {this.props.children}
      <br />
      <br />
      {ifEl(!(cur_page.get() === 0), <button onClick={prevPage}>Prev</button>)}
      {ifEl(cur_page.get() < (pages.length - 1), <button onClick={nextPage}>Next</button>)}
    </div>
  }
}


function renderInput(field) {
  return <input value={form_info[field]} onChange={handleChange(field)} required />
}

function renderSelectField(options, fieldName) {
  return <select value={form_info[fieldName]} onChange={handleChange(fieldName)}>
    {
      options.map(opt => {
        return <option key={opt} value={opt}>{opt}</option>
      })
    }
  </select>
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

function ifEl(arg, el) {
  if (arg) return el
  else return ''
}
