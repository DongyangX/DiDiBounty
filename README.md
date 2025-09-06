# DiDiBounty

A solidity example use truffle and react. You can release a bounty and the hunter will take part in. By using web3, nobody knows who release the bounty and who join in, that's nice.

## Environment
Node, truffle or hardhat

## Start

Start the truffle network
```sh
$ cd truffle
$ truffle develop
```
Or if use hardhat network, you should modify the networks config in `truffle-config.js`, the port should be `8545`

```js
development: {
  host: "127.0.0.1",     // Localhost (default: none)
  port: 8545,            // Standard Ethereum port (default: none)
  network_id: "*",       // Any network (default: none)
}
```

Deploy the contracts
```sh
$ truffle migrate --network development
```

Start the react dev server.

```sh
$ cd client
$ npm start
```
