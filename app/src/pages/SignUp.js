import { useFormState } from 'react-use-form-state';
import React from 'react';

export function SignUp() {
    const [formState, {text, password}] = useFormState()
    return (
        <form onSubmit={e => e.preventDefault() || console.log(formState)}>
            username: <input {...text('username')} /> <br />
            password: <input {...password('password')} required minLength="8" />
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}