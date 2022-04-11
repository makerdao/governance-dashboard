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
} from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'

import AutocompleteInput from '../components/AutocompleteInput'
import { UserBalances } from '../lib/types/delegate'

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mode, setMode] = useState<PaletteMode>('light')
  const [mkrBalancesData, setMkrBalancesData] = useState<UserBalances[]>()
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage.getItem('theme'))
      setMode(localStorage.getItem('theme') as PaletteMode)
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newMode)
    setMode(newMode)
  }

  const handleSelectDelegate = (
    address: string | null,
    delegate?: string
  ): void => {
    setSelectedDelegate(delegate || null)
    setSelectedAddress(address)
  }

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: 'hsl(173, 74%, 39%)' },
      background: {
        default: mode === 'light' ? '#f7f8f9' : '#121212',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>MakerDAO Governance Dashboard</title>
          <meta
            name='description'
            content='A dashboard containing metrics about MakerDAO governance and delegation'
          />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <AppBar color='default'>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <div className={styles.logoContainer}>
                <Image
                  src='/makerlogo.png'
                  alt='Maker logo'
                  width={42}
                  height={30}
                />
                <Typography variant='h6'>
                  MakerDAO Governance Dashboard
                </Typography>
              </div>
            </Box>
            <Box sx={{ display: 'flex', gap: '0.5em' }}>
              <div className={styles.navigationContainer}>
                <Link href='/'>Charts</Link>
                <Link href='/governance/active'>Tracker</Link>
              </div>
              {router.route === '/' && (
                <AutocompleteInput
                  mkrBalancesData={mkrBalancesData}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={handleSelectDelegate}
                />
              )}

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

        <Component
          {...pageProps}
          toggleMode={toggleMode}
          theme={theme}
          setMkrBalancesData={setMkrBalancesData}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          selectedDelegate={selectedDelegate}
          setSelectedDelegate={setSelectedDelegate}
        />

        <Box
          bgcolor='background.default'
          borderTop='1px solid'
          borderColor='divider'
        >
          <footer className={styles.footer}>
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
          </footer>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default MyApp
