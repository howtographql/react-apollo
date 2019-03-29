import { useFormState } from 'react-use-form-state'
import React from 'react'

export function Form() {
    const [formState, { label, text, email, password, radio }] = useFormState()
    const redLabel = (...args) => {
        const field = args.slice(0, args.length - 1)
        const label_text = args[args.length - 1]
        return <label {...label(...field)}><span style={{color: formState.touched[field] && !formState.validity[field] ? 'red' : 'black'}}>{label_text}</span></label>
    }

    return <form onSubmit={e => e.preventDefault() || console.log(formState)}>
        {redLabel('name', 'Full Name')}
        <input {...text('name')} />
        <br />

        {redLabel('email', "Email")}
        <input {...email('email')} />
        <br />

        {redLabel('password', 'Password')}
        <input {...password('password')} required minLength="8" />
        <br />

        Plan:
        <br />
        
        {redLabel('plan', 'free', 'Free Plan')}
        <input {...radio('plan', 'free')} />
        <br />
        {redLabel('plan', 'free', 'Premium Plan')}
        <input {...radio('plan', 'premium')} />
        <br />
        <button type="submit">Submit</button>
    </form>
}
