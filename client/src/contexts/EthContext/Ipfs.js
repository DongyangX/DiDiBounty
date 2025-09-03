import { create } from 'ipfs-http-client'

const IPFS =  {domain:"127.0.0.1", urlPrefix:"http://127.0.0.1:8081/ipfs/"}

const ipfs = create({
  host: IPFS.domain,
  port: 5001,
  protocol: 'http'
})

const addToIpfs = async (entity) => {
  const added = await ipfs.add(entity)
  const cid = added.path
  return cid;
}

export {addToIpfs, IPFS};