import { useEffect, useState } from 'react'
import useEth from '../contexts/EthContext/useEth'
import * as React from 'react'
import Box from '@mui/material/Box'
import Masonry from '@mui/lab/Masonry'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { IPFS } from '../contexts/EthContext/Ipfs'
import { useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/system/Stack'
import { enqueueSnackbar } from 'notistack'

function MyRelease() {
  const { state } = useEth()

  const [items, setItems] = useState([])
  const [pageSizeTotal, setPageSizeTotal] = useState(1)

  useEffect(() => {
    async function fetchData() {
      const allBounties = await state.contract.methods
        .getCreatorBounties()
        .call({ from: state.accounts[0] })
      console.log(allBounties)
      const artifact = require('../contracts/Bounty.json')
      const { abi } = artifact
      let data = allBounties.map(function (addr) {
        return new Promise(async (resolve, reject) => {
          try {
            // 加载悬赏合约
            const bc = new state.web3.eth.Contract(abi, addr)
            let manager = await bc.methods.manager().call()
            let title = await bc.methods.title().call()
            let content = await bc.methods.content().call()
            let mainPic = await bc.methods.mainPic().call()
            let targetMoney = await bc.methods.targetMoney().call()
            let joinMoney = await bc.methods.joinMoney().call()
            let status = await bc.methods.status().call()

            let item = {
              addr: addr,
              manager: manager,
              title: title,
              content: content,
              mainPic: IPFS.urlPrefix + mainPic,
              targetMoney: state.web3.utils.fromWei(targetMoney, 'ether'),
              joinMoney: state.web3.utils.fromWei(joinMoney, 'ether'),
              status: status,
            }
            resolve(item)
          } catch (e) {
            reject(e)
          }
        })
      })
      return Promise.all(data)
    }
    async function getData() {
      if (!state.accounts || state.accounts.length === 0) {
        // not connect
        enqueueSnackbar('Pleace connect wallet first!', {
          variant: 'warning',
        })
        return
      }

      let datas = await fetchData()
      let total = Math.ceil(datas.length / 8)
      console.log(datas)
      setPageSizeTotal(total)
      setItems(datas)
    }
    getData()
  }, [state.accounts])

  const navigate = useNavigate()

  const toDetail = (obj) => {
    localStorage.setItem('detail', JSON.stringify(obj))
    navigate('/detail/' + obj.addr)
  }

  return (
    <div>
      <Stack
        spacing={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ p: 4, width: '100%', border: '1px dashed grey' }}>
          <Masonry columns={4} spacing={2}>
            {items.map((item, index) => (
              <div key={item.addr}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea onClick={() => toDetail(item)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.mainPic}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {item.content}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            ))}
          </Masonry>
        </Box>
        <Pagination count={pageSizeTotal} color="primary" />
      </Stack>
    </div>
  )
}

export default MyRelease
