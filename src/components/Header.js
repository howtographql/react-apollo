import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'
import { IconButton, Toolbar, AppBar, Typography, withStyles, Drawer, ListItem, List, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

function Header(props) {
  const { classes } = props
  const authToken = localStorage.getItem(AUTH_TOKEN)
  const [drawer, setDrawer] = useState(false)
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={()=>setDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Hacker News
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer} onClose={()=>setDrawer(false)}>
        <List>
            {[
              ['New', '/'],
              ['Top', '/top'],
              ['Search', '/search'],
            ].map(([text, link]) => (
              <div 
                tabIndex={0}
                role="button"
                onClick={() => setDrawer(false)}
                onKeyDown={() => setDrawer(false)}
              >
                <Link to={link} key={text}>
                  <ListItem button>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              </div>
            ))}
        </List>
      </Drawer>
        {/* <div className="fw7 mr1">Hacker News</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN)
              props.history.push(`/`)
            }}
          >
            logout
          </div>
        ) : (
            <Link to="/sign-in" className="ml1 no-underline black">
              Sign In/Sign Up
          </Link>
          )}
      </div> */}
    </div>
  )
}

export default withStyles(styles)(withRouter(Header))