import { EthProvider } from './contexts/EthContext'
import * as React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, Link } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import StorefrontIcon from '@mui/icons-material/Storefront'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import WalletButton from './components/WalletButton'
import { SnackbarProvider } from 'notistack'

const drawerWidth = 240

function ListItemLink(props) {
  const { icon, primary, to, selected, onClick } = props

  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={selected}
      onClick={onClick}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  )
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  return (
    <div>
      <EthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={4000}
        >
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  滴滴悬赏
                </Typography>
                <WalletButton />
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Toolbar />
              <Box sx={{ overflow: 'auto' }}>
                <List>
                  <ListItem key="home" disablePadding>
                    <ListItemLink
                      to="/"
                      selected={selectedIndex === 0}
                      onClick={(event) => handleListItemClick(event, 0)}
                      icon={<StorefrontIcon />}
                      primary="市场"
                    />
                  </ListItem>
                  <ListItem key="create" disablePadding>
                    <ListItemLink
                      to="/create"
                      selected={selectedIndex === 1}
                      onClick={(event) => handleListItemClick(event, 1)}
                      icon={<AddCircleOutlineOutlinedIcon />}
                      primary="发布"
                    />
                  </ListItem>
                  <ListItem key="myRelease" disablePadding>
                    <ListItemLink
                      to="/myrelease"
                      selected={selectedIndex === 2}
                      onClick={(event) => handleListItemClick(event, 2)}
                      icon={<AddReactionIcon />}
                      primary="我发布的"
                    />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Toolbar />
              <Outlet />
            </Box>
          </Box>
        </SnackbarProvider>
      </EthProvider>
    </div>
  )
}

export default App
