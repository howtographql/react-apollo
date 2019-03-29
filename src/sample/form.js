import { useFormState } from 'react-use-form-state'
import React from 'react'

export function Form() {
    const [formState, { text, email, password, radio }] = useFormState()

    return <form onSubmit={e => e.preventDefault() || console.log(formState)}>
        Name: <input {...text('name')} />
        <br />
        <span style={{color: formState.touched.email && !formState.validity.email ? 'red' : 'black'}}>Email</span>: <input {...email('email')} />
        <br />
        Password: <input {...password('password')} required minLength="8" />
        <br />
        Plan:
        <br />
        Free <input {...radio('plan', 'free')} />
        <br />
        Premium: <input {...radio('plan', 'premium')} />
        <button type="submit">Submit</button>
    </form>
}
