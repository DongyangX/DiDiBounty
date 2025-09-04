import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Web3 from 'web3'
import useEth from '../contexts/EthContext/useEth'

function WalletButton() {
  const { state } = useEth()

  const [buttonText, setButtonText] = useState('Connect')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!state.accounts || state.accounts.length === 0) {
      setConnected(false)
    } else {
      showAccount()
      setConnected(true)
    }
  }, [state.accounts])

  const showAccount = () => {
    let accounts = state.accounts
    let address = accounts[0].substring(0, 4) + '...' + accounts[0].slice(-4)
    setButtonText(address)
  }

  const connectWallet = async () => {
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
    const accounts = await web3.eth.requestAccounts()
    state.accounts = accounts
    showAccount()
    setConnected(true)
  }

  const disconnectWallet = () => {
    state.accounts = []
    setConnected(false)
    setButtonText('Connect')
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => (connected ? disconnectWallet() : connectWallet())}
    >
      {buttonText}
    </Button>
  )
}

export default WalletButton
