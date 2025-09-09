import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { deepOrange, red } from '@mui/material/colors'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import useEth from '../contexts/EthContext/useEth'
import Stack from '@mui/system/Stack'
import TextField from '@mui/material/TextField'
import Input from '@mui/material/Input'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { addToIpfs, IPFS } from '../contexts/EthContext/Ipfs'
import { useParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

function Detail() {
  const { state } = useEth()
  // Will show 404 when refresh detail page
  // const detail = useSelector((states) => states.global.detail)

  const detail = JSON.parse(localStorage.getItem('detail'))

  const [items, setItems] = useState([])
  const [prove, setProve] = useState('')
  const [fileHash, setFileHash] = useState(null)
  const [finishIndex, setFinishIndex] = useState(0)
  const [status, setStatus] = useState('0')
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      const addr = params.addr
      console.log(addr)
      // const addr = state.detail.addr;
      if (!state.web3) {
        return
      }

      const artifact = require('../contracts/Bounty.json')
      const { abi } = artifact
      const bc = new state.web3.eth.Contract(abi, addr)

      let count = await bc.methods
        .getHuntingsCount()
        .call({ from: state.accounts[0] })
      console.log('count=' + count)
      let datas = []
      for (let i = 0; i < count; i++) {
        let hunting = await bc.methods
          .allHuntings(i)
          .call({ from: state.accounts[0] })
        console.log(hunting)
        datas.push(hunting)
      }
      setItems(datas)
    }
    // Fetch Data
    fetchData()
    setStatus(detail.status)
  }, [state.accounts])

  const [joinOpen, setJoinOpen] = useState(false)
  const [finishOpen, setFinishOpen] = useState(false)

  const handleJoinDialogOpen = () => {
    if (!state.accounts || state.accounts.length === 0) {
      enqueueSnackbar('Pleace connect wallet first!', {
        variant: 'warning',
      })
      return
    }
    setJoinOpen(true)
  }

  const handleJoinDialogClose = () => {
    setJoinOpen(false)
  }

  const handleFinishDialogOpen = () => {
    if (!state.accounts || state.accounts.length === 0) {
      enqueueSnackbar('Pleace connect wallet first!', {
        variant: 'warning',
      })
      return
    }
    setFinishOpen(true)
  }

  const handleFinishDialogClose = () => {
    setFinishOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!state.accounts || state.accounts.length === 0) {
      enqueueSnackbar('Pleace connect wallet first!', {
        variant: 'warning',
      })
      return
    }
    if (!prove || !fileHash) {
      enqueueSnackbar('Pleace enter prove and upload file', {
        variant: 'error',
      })
      return
    }

    try {
      // Submit hunting info
      const addr = detail.addr
      const artifact = require('../contracts/Bounty.json')
      const { abi } = artifact
      const bc = new state.web3.eth.Contract(abi, addr)
      let joinMoneyWei = state.web3.utils.toWei(detail.joinMoney, 'ether')
      let tx = await bc.methods
        .hunt(prove, fileHash)
        .send({ from: state.accounts[0], value: joinMoneyWei })
      console.log(tx)
      handleJoinDialogClose()
      enqueueSnackbar('Transaction success!', { variant: 'success' })
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Transaction error!', { variant: 'error' })
    }
  }

  const goFinish = (index) => {
    handleFinishDialogOpen()
    setFinishIndex(index)
  }

  const handleFinish = async (event) => {
    event.preventDefault()

    if (!state.accounts || state.accounts.length === 0) {
      enqueueSnackbar('Pleace connect wallet first!', {
        variant: 'warning',
      })
      return
    }

    try {
      // Finish bounty and transfer reward to hunter(the winner)
      const addr = detail.addr
      const artifact = require('../contracts/Bounty.json')
      const { abi } = artifact
      const bc = new state.web3.eth.Contract(abi, addr)
      let tx = await bc.methods
        .finishBounty(finishIndex)
        .send({ from: state.accounts[0] })
      console.log(tx)
      handleFinishDialogClose()
      enqueueSnackbar('Transaction success!', { variant: 'success' })
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Transaction error!', { variant: 'error' })
    }
  }

  const saveToIpfs = async (event) => {
    try {
      const cid = await addToIpfs(event.target.files[0])
      console.log(cid)
      enqueueSnackbar('Upload success!', { variant: 'success' })
      setFileHash(cid)
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Upload error!', { variant: 'error' })
    }
  }

  return (
    <div>
      <Stack>
        <Box
          sx={{
            display: 'flex',
            borderRadius: 10,
            bgcolor: 'white',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Release by
          </Typography>
          <Avatar sx={{ bgcolor: deepOrange[500] }}></Avatar>
          <Typography variant="h6" gutterBottom>
            {detail.addr}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={6}>
            <Box>
              <img
                style={{ width: '500px', height: '500px' }}
                src={detail.mainPic}
                loading="lazy"
                alt="Main Pic"
              />
            </Box>
          </Grid>

          <Grid size={6}>
            <Box>
              <Typography sx={{ color: red[500] }} variant="h3" gutterBottom>
                {detail.targetMoney}ETH
              </Typography>

              <Typography variant="h3" gutterBottom>
                {detail.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {detail.content}
              </Typography>
              {status === '0' && (
                <Button variant="contained" onClick={handleJoinDialogOpen}>
                  Join Bounty
                </Button>
              )}
              <Typography>
                You should pay {detail.joinMoney} ETH to join, all ETH will
                transfer to winner that who actuality finish the work.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Stack
          sx={{
            width: '100%',
          }}
        >
          {items.map((item, index) => (
            <div key={index}>
              <Accordion
                sx={{
                  width: '100%',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={index}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar>{index}</Avatar>
                  <Typography component="span">{item.hunter}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {item.prove}

                  {item.pic && (
                    <div>
                      <img
                        style={{
                          width: '500px',
                          height: '500px',
                        }}
                        src={IPFS.urlPrefix + item.pic}
                        alt={item.pic}
                      />
                    </div>
                  )}
                </AccordionDetails>
                {status === '0' && (
                  <AccordionActions>
                    <Button onClick={() => goFinish(index)}>确认</Button>
                  </AccordionActions>
                )}
              </Accordion>
            </div>
          ))}
        </Stack>
      </Stack>

      <React.Fragment>
        <Dialog open={joinOpen} onClose={handleJoinDialogClose}>
          <DialogTitle>Submit Hunting</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please type in the prove and upload the picture
            </DialogContentText>
            <form onSubmit={handleSubmit} id="subscription-form">
              <TextField
                id="prove"
                value={prove}
                multiline
                rows={4}
                label="prove"
                variant="outlined"
                onChange={(e) => setProve(e.target.value)}
                sx={{ width: '100%' }}
              />
              <Input
                type="file"
                id="input-file"
                name="input-file"
                onChange={saveToIpfs}
                sx={{ width: '100%' }}
              />
              {fileHash && (
                <div>
                  <img src={IPFS.urlPrefix + fileHash} alt={fileHash} />
                </div>
              )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleJoinDialogClose}>Cancel</Button>
            <Button type="submit" form="subscription-form">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={finishOpen}
          onClose={handleFinishDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Comfirm And Transfer
          </DialogTitle>
          <DialogContent>
            <DialogContentText color="red" id="alert-dialog-description">
              Warning!!! This operation will transfer all the bounty reward to
              this hunter, and platform will collect 10% ETH service fee. Please
              confirm!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFinishDialogClose}>Cancel</Button>
            <Button onClick={handleFinish} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  )
}

export default Detail
