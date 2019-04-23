import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'
import { IconButton, Toolbar, AppBar, Typography, withStyles, Drawer, ListItem, List, ListItemText, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import classNames from 'classnames'

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
  menuLink: {
    textDecoration: 'none',
    color: 'white',
  },
  drawerLink: {
    textDecoration: 'none',
  },
  list: {
    width: 250
  }
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
          <Link to="/" className={classNames(classes.grow, classes.menuLink)}>
            <Typography variant="h6" color="inherit">
              Hacker News
            </Typography>
          </Link>
          {authToken ?
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                props.history.push(`/`)
              }}
            >
              Sign Out
            </Button> :
            <>
            <Link to="/sign-in" className={classes.menuLink}>
              <Button color="inherit">Sign In</Button>
            </Link> / 
            <Link to="/sign-up" className={classes.menuLink}>
              <Button color="inherit">Sign Up</Button>
            </Link>
            </>
          }
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer} onClose={()=>setDrawer(false)}>
      <div className={classes.list}>
        <List>
            {[
              ['New', '/', true],
              ['Top', '/top', true],
              ['Search', '/search', true],
              ['Submit', '/submit', authToken]
            ].map(([text, link, display]) => (
              display && <div 
                tabIndex={0}
                role="button"
                onClick={() => setDrawer(false)}
                onKeyDown={() => setDrawer(false)}
                key={text}
              >
                <Link to={link} className={classes.drawerLink}>
                  <ListItem button>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              </div>
            ))}
        </List>
      </div>
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