import { useState, useEffect } from 'react'
import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {
  ThemeProvider,
  createTheme,
  PaletteMode,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  CheckBox as CheckBoxIcon,
  AssignmentLate as AssignmentLateIcon,
  WatchLater as WatchLaterIcon,
} from '@mui/icons-material'

import { TrackerProvider } from '../context/TrackerContext'
import { DelegatesProvider } from '../context/DelegatesContext'
import { DashboardProvider } from '../context/DashboardContext'

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mode, setMode] = useState<PaletteMode>('light')

  const drawerWidth = 240

  useEffect(() => {
    if (localStorage.getItem('theme'))
      setMode(localStorage.getItem('theme') as PaletteMode)
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newMode)
    setMode(newMode)
  }

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: 'hsl(173, 74%, 39%)' },
      secondary: {
        main: 'hsla(41, 90%, 57%, 1)',
        light: 'hsla(41, 90%, 57%, 0.6)',
      },
      background: {
        default: mode === 'light' ? '#f7f8f9' : '#121212',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <DashboardProvider>
        <TrackerProvider>
          <DelegatesProvider>
            <div className={styles.container}>
              <Head>
                <title>Governance Dashboard</title>
                <meta
                  name='description'
                  content='A dashboard containing Maker governance and delegation stats as well as proposals information'
                />
                <link rel='icon' href='/favicon.ico' />
              </Head>

              <AppBar
                color='default'
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
              >
                <Toolbar component='nav'>
                  <Box sx={{ flexGrow: 1 }}>
                    <div className={styles.logoContainer}>
                      <Image
                        src='/makerlogo.png'
                        alt='Maker logo'
                        width={42}
                        height={30}
                      />
                      <Typography variant='h6'>Governance Dashboard</Typography>
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '0.5em' }}>
                    <div className={styles.navigationContainer}>
                      <Link href='/' passHref>
                        <Typography
                          color={
                            router.route === '/'
                              ? (theme) => theme.palette.primary.main
                              : ''
                          }
                        >
                          Stats
                        </Typography>
                      </Link>
                      <Divider
                        orientation='vertical'
                        flexItem
                        variant='middle'
                      />
                      <Link href='/tracker' passHref>
                        <Typography
                          color={
                            router.route.startsWith('/tracker')
                              ? (theme) => theme.palette.primary.main
                              : ''
                          }
                        >
                          Tracker
                        </Typography>
                      </Link>
                      <Divider
                        orientation='vertical'
                        flexItem
                        variant='middle'
                      />
                      <Link href='/delegates' passHref>
                        <Typography
                          color={
                            router.route.startsWith('/delegates')
                              ? (theme) => theme.palette.primary.main
                              : ''
                          }
                        >
                          Delegates
                        </Typography>
                      </Link>
                    </div>

                    <Divider orientation='vertical' flexItem variant='middle' />

                    <IconButton onClick={toggleMode}>
                      {theme.palette.mode === 'dark' ? (
                        <Brightness7 />
                      ) : (
                        <Brightness4 />
                      )}
                    </IconButton>
                  </Box>
                </Toolbar>
              </AppBar>

              {router.route.startsWith('/tracker') && (
                <Drawer
                  variant='persistent'
                  open={true}
                  sx={{
                    width: drawerWidth,
                    [`& .MuiDrawer-paper`]: {
                      width: drawerWidth,
                      boxSizing: 'border-box',
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                    },
                  }}
                >
                  <Toolbar />
                  <List>
                    {[
                      { text: 'Overview', route: '/tracker' },
                      {
                        text: 'Executive votes',
                        route: '/tracker/executive-votes',
                      },
                      {
                        text: 'On-Chain polls',
                        route: '/tracker/on-chain-polls',
                      },
                      {
                        text: 'Off-Chain polls',
                        route: '/tracker/off-chain-polls',
                      },
                      {
                        text: 'Forum discussions',
                        route: '/tracker/forum-discussions',
                      },
                      {
                        text: 'Archived proposals',
                        route: '/tracker/archived-proposals',
                      },
                    ].map(({ text, route }, index) => (
                      <Link passHref href={route} key={index}>
                        <ListItemButton selected={router.route === route}>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    {[
                      {
                        text: 'Active',
                        icon: <CheckBoxIcon />,
                        route: '/tracker/active',
                      },
                      {
                        text: 'High impact',
                        icon: <AssignmentLateIcon />,
                        route: '/tracker/high-impact',
                      },
                      {
                        text: 'Ending this week',
                        icon: <WatchLaterIcon />,
                        route: '/tracker/ending-this-week',
                      },
                    ].map(({ text, icon, route }, index) => (
                      <Link passHref href={route} key={index}>
                        <ListItemButton selected={router.route === route}>
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Drawer>
              )}

              <Box
                component='main'
                className={
                  router.route.startsWith('/tracker')
                    ? router.route === '/tracker'
                      ? styles.mainFlexOverview
                      : styles.mainFlex
                    : router.route === '/_error'
                    ? styles.mainFlex
                    : router.route.startsWith('/delegates')
                    ? styles.delegatesSection
                    : styles.main
                }
                sx={{
                  bgcolor: 'background.default',
                  marginLeft: router.route.startsWith('/tracker')
                    ? `${drawerWidth}px`
                    : 0,
                }}
              >
                <Component {...pageProps} />
              </Box>

              <Box
                bgcolor='background.default'
                borderTop='1px solid'
                borderColor='divider'
                position='relative'
                left='0'
                bottom='0'
                width='100%'
                zIndex='1500'
              >
                <Toolbar component='footer' className={styles.footer}>
                  <div>
                    <Typography color='text.secondary'>
                      Built by{' '}
                      <a
                        target='_blank'
                        rel='noreferrer'
                        href='https://forum.makerdao.com/u/hernandoagf'
                      >
                        hernandoagf
                      </a>
                    </Typography>
                  </div>
                </Toolbar>
              </Box>
            </div>
          </DelegatesProvider>
        </TrackerProvider>
      </DashboardProvider>
    </ThemeProvider>
  )
}

export default MyApp
