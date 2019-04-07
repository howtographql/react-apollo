import React from 'react'
import { AUTH_TOKEN } from '../../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useFormState } from 'react-use-form-state';
import { CssBaseline, FormControl, InputLabel, Input, withStyles, Paper, Avatar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function SignUp(props) {
  const { classes } = props

  const [formState, { text, email, password }] = useFormState()
  const _confirm = async data => {
    const { token } = data.signup
    _saveUserData(token)
    props.history.push(`/`)
  }

  const _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input {...email('email')} autoComplete="email" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input {...text('name')} autoComplete="name" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="name">Password</InputLabel>
          <Input {...password('password')} autoComplete="password" autoFocus type="password" />
        </FormControl>
        <Mutation
          mutation={SIGNUP_MUTATION}
          variables={formState.values}
          onCompleted={data => _confirm(data)}
        >
          {mutation => (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={mutation}
            >
              Sign Up
            </Button>
          )}
        </Mutation>
        </form>
        <br />
        <Typography component="h5">
        <Link to="/sign-in">Already have an account? Click here</Link>
        </Typography>
      </Paper>
    </main>
  )
}

export default withStyles(styles)(SignUp)
