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

function Detail() {
  const { state } = useEth()

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
    // 加载数据
    fetchData()
    setStatus(state.detail.status)
  }, [])

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
      // 提交悬赏
      const addr = state.detail.addr
      const artifact = require('../contracts/Bounty.json')
      const { abi } = artifact
      const bc = new state.web3.eth.Contract(abi, addr)
      let joinMoneyWei = state.web3.utils.toWei(state.detail.joinMoney, 'ether')
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
      // 结束悬赏发放
      const addr = state.detail.addr
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
            由
          </Typography>
          <Avatar sx={{ bgcolor: deepOrange[500] }}></Avatar>
          <Typography variant="h6" gutterBottom>
            {state.detail.addr}
          </Typography>
          <Typography variant="h6" gutterBottom>
            发布
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={6}>
            <Box>
              <img
                style={{ width: '500px', height: '500px' }}
                src={state.detail.mainPic}
                loading="lazy"
                alt="主图"
              />
            </Box>
          </Grid>

          <Grid size={6}>
            <Box>
              <Typography sx={{ color: red[500] }} variant="h3" gutterBottom>
                {state.detail.targetMoney}ETH
              </Typography>

              <Typography variant="h3" gutterBottom>
                {state.detail.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {state.detail.content}
              </Typography>
              {status === '0' && (
                <Button variant="contained" onClick={handleJoinDialogOpen}>
                  参与悬赏
                </Button>
              )}
              <Typography>
                需要缴纳 {state.detail.joinMoney} ETH
                参与,全部ETH将会发放给完成者账户
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
          <DialogTitle>提交悬赏</DialogTitle>
          <DialogContent>
            <DialogContentText>在下面填写说明与证明</DialogContentText>
            <form onSubmit={handleSubmit} id="subscription-form">
              <TextField
                id="prove"
                value={prove}
                multiline
                rows={4}
                label="说明"
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
            <Button onClick={handleJoinDialogClose}>取消</Button>
            <Button type="submit" form="subscription-form">
              确定
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={finishOpen}
          onClose={handleFinishDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">确认发放悬赏</DialogTitle>
          <DialogContent>
            <DialogContentText color="red" id="alert-dialog-description">
              注意!!!此操作将发放悬赏到该用户,平台将收取10%悬赏金额作为服务费,请您确认
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFinishDialogClose}>取消</Button>
            <Button onClick={handleFinish} autoFocus>
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  )
}

export default Detail
