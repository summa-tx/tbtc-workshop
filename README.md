### SPV Workshop

This is a brief exercise on validating SPV Proofs using `bitcoin-spv`. It
includes one contract (`SPVLogger.sol`) that verifies payments made to James.

Your goal is to make the tests pass by implementing a Bitcoin SPV system. We've
provided tests,

### Warning

THIS IS NOT INTENDED FOR PRODUCTION AND THE CODE DOES NOT ACCOMPLISH SECURE SPV
COMMUNICATION

### How to play :)

Clone this repo and run:

```bash
$ npm i -g truffle
$ npm i
$ truffle test
```

You'll see that the tests do not pass. The `SPVLogger` contract is not fully
implemented! You'll need to go through the file and fill lines around each
comment starting with `// Goal`. They'll have instructions, and always use one
or more of [BytesLib](https://github.com/summa-tx/bitcoin-spv/blob/master/solidity/contracts/BytesLib.sol),
[BTCUtils](https://github.com/summa-tx/bitcoin-spv/blob/master/solidity/contracts/BTCUtils.sol),
or [ValidateSPV](https://github.com/summa-tx/bitcoin-spv/blob/master/solidity/contracts/ValidateSPV.sol).

The answers can be found by switching to the `working` branch.
But that's cheating :)
