import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import {addToIpfs, IPFS} from '../contexts/EthContext/Ipfs';
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Create() {

  const { state } = useEth();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");
  const [fileHash, setFileHash] = useState(null);
  const [huntAmount, setHuntAmount] = useState("");

  const handleNumberChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  const handleNumberChange2 = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setHuntAmount(e.target.value);
    }
  };

  const navigate = useNavigate();

  const callFactoryCreate = async e => {
    let amountWei = state.web3.utils.toWei(amount, 'ether');
    let huntAmountWei = state.web3.utils.toWei(huntAmount, 'ether');
    let tx = await state.contract.methods.createBounty(title, content, fileHash, amountWei, huntAmountWei)
      .send({ from: state.accounts[0], value: amountWei });
    console.log(tx);
    // Return HomePage
    navigate('/');
  };

  const saveToIpfs = async (event) => {
    const cid = await addToIpfs(event.target.files[0]);
    console.log(cid);
    setFileHash(cid)
  }

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Stack
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="title" value={title} label="标题" variant="outlined" 
            onChange={e => setTitle(e.target.value)}
          />
          <TextField id="amount" value={amount} label="悬赏金额(ETH)" variant="outlined"
            onChange={handleNumberChange}
          />
          <TextField id="huntAmount" value={huntAmount} label="每次参与金额(ETH)" variant="outlined"
            onChange={handleNumberChange2}
          />
          <TextField
              id="content"
              value={content}
              label="内容"
              multiline
              rows={10}
              onChange={e => setContent(e.target.value)}
            />
          <Input type="file"
              id="input-file"
              name="input-file"
              onChange={saveToIpfs}
              />
          {fileHash &&
            <div>
              <img
                style={{ width: '500px', height: '500px' }}
                src={IPFS.urlPrefix + fileHash}
                alt={fileHash}/>
            </div>
            }
          <Button variant="contained" onClick={callFactoryCreate}>提交</Button>    
        </Stack>
      </Box>
    </div>
  )
}

export default Create;