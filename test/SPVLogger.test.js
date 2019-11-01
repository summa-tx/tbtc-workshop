const expect = require("chai").expect
const SPVLogger = artifacts.require("SPVLogger")

let wrongRecipientProof, rightProof // set below the tests to reduce noise


describe("JamesPays", () => {
  describe("when checking a funding proof with bad vin", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        wrongRecipientProof.bitcoinHeaders,
        wrongRecipientProof.merkleProof,
        wrongRecipientProof.version,
        wrongRecipientProof.txLocktime,
        wrongRecipientProof.txIndexInBlock,
        1,
        "0xDEADBEEF",
        wrongRecipientProof.txOutputVector,
      )

      return { logger, startingBlockNumber }
    }

    it("should not emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })

    it("should emit a WhyJamesNotPaid event due to bad input", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const errorCode = eventList[0].args.errorCode.toString()
      expect(errorCode).to.equal((await logger.ERR_BAD_VIN()).toString())
    })
  })

  describe("when checking a funding proof with bad vout", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        wrongRecipientProof.bitcoinHeaders,
        wrongRecipientProof.merkleProof,
        wrongRecipientProof.version,
        wrongRecipientProof.txLocktime,
        wrongRecipientProof.txIndexInBlock,
        1,
        wrongRecipientProof.txInputVector,
        "0xDEADBEEF",
      )

      return { logger, startingBlockNumber }
    }

    it("should not emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })

    it("should emit a WhyJamesNotPaid event due to bad output", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const errorCode = eventList[0].args.errorCode.toString()
      expect(errorCode).to.equal((await logger.ERR_BAD_VOUT()).toString())
    })
  })

  describe("when checking a funding proof with bad proof", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        wrongRecipientProof.bitcoinHeaders,
        "0xDEADBEEF",
        wrongRecipientProof.version,
        wrongRecipientProof.txLocktime,
        wrongRecipientProof.txIndexInBlock,
        1,
        wrongRecipientProof.txInputVector,
        wrongRecipientProof.txOutputVector,
      )

      return { logger, startingBlockNumber }
    }

    it("should not emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })

    it("should emit a WhyJamesNotPaid event due to bad proof", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const errorCode = eventList[0].args.errorCode.toString()
      expect(errorCode).to.equal((await logger.ERR_BAD_PROOF()).toString())
    })
  })

  describe("when checking a funding proof with wrong recipient", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        wrongRecipientProof.bitcoinHeaders,
        wrongRecipientProof.merkleProof,
        wrongRecipientProof.version,
        wrongRecipientProof.txLocktime,
        wrongRecipientProof.txIndexInBlock,
        1,
        wrongRecipientProof.txInputVector,
        wrongRecipientProof.txOutputVector,
      )

      return { logger, startingBlockNumber }
    }

    it("should not emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })

    it("should emit a WhyJamesNotPaid event due to not paying James", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const errorCode = eventList[0].args.errorCode.toString()
      expect(errorCode).to.equal((await logger.ERR_DOES_NOT_PAY_JAMES()).toString())
    })

  })

  describe("when checking a funding proof with incorrect amount", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        rightProof.bitcoinHeaders,
        rightProof.merkleProof,
        rightProof.version,
        rightProof.txLocktime,
        rightProof.txIndexInBlock,
        0,
        rightProof.txInputVector,
        rightProof.txOutputVector,
      )

      return { logger, startingBlockNumber }
    }

    it("should not emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })

    it("should emit a WhyJamesNotPaid event due to needing to pay James more", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const errorCode = eventList[0].args.errorCode.toString()
      expect(errorCode).to.equal((await logger.ERR_MUST_PAY_JAMES_MORE()).toString())
    })

  })

  describe("when checking the correct testnet funding proof", () => {
    async function payJames() {
      const startingBlockNumber = await web3.eth.getBlock('latest').number

      const logger = await SPVLogger.new()
      await logger.paysJames(
        rightProof.bitcoinHeaders,
        rightProof.merkleProof,
        rightProof.version,
        rightProof.txLocktime,
        rightProof.txIndexInBlock,
        1,
        rightProof.txInputVector,
        rightProof.txOutputVector,
      )

      return { logger, startingBlockNumber }
    }

    it("should emit a JamesPaid event", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'JamesPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(1)
      const txid = eventList[0].args.txid.toString()
      expect(txid).to.equal("0x9ed54e58276931fb514ebdb7f2e56831663c7c9a9c26c2713147b4d085bd2530")
    })

    it("should not emit a WhyJamesNotPaid", async () => {
      const { logger, startingBlockNumber } = await payJames()
      const eventList = await logger.getPastEvents(
        'WhyJamesNotPaid',
        { fromBlock: startingBlockNumber, toBlock: 'latest' },
      )

      expect(eventList.length).to.equal(0)
    })
  })
})

// real tx from testnet bitcoin, not to our target address
// tx source: https://live.blockcypher.com/btc-testnet/tx/f0caf868042a1abfeb497f6216a440fbf0eca703c117defe12869339d0acc1f1/
wrongRecipientProof = {
  version: '0x02000000',
  txIndexInBlock: 2,
  bitcoinHeaders: '0x00000020e132a0c6c3d18b33005f29a39210b14d7ce7dafd167dff42a1fa000000000000ced28805534d831504038dab205ac31cb9627deaaba1d02b46ccae0392c75f53d6babb5dffff001b068f803c000040203b14957684aff3272d47de8ee8df2bf21faa729996baffb51d6d000000000000a5afde3105a5e0b72070cd109396bf4f74f74a59c3fb29df65cc3e1a006e7946b4babb5dffff001bbc528937',
  txInputVector: '0x027f9f9652509e4a55e29dd322821cf3899dbf4636c4604a627b1d76781e356ad20100000000feffffff8fe116f0c89fe217199223d249abd8533537ceec7cc9c32277a9a792d6b956c8010000001716001484292d352d50ca4edeaeda18b04d5a3b3666fe44feffffff',
  txOutputVector: '0x0240420f000000000016001404465340d248af2711cf0dc1971143017b59ce9f87041800000000001600141c0d1989b3fe9293d6fa1e95358d149e5b2aec36',
  txLocktime: '0xb36f1800',
  merkleProof: '0x3f4d585a4a60485e04c4e18a5e90da696ce8d8a4255af0b0e64bda3ac23db4297ee347fce433c707ced9c9737e01ab4a102c6af07d5a22b9398bb64023a67463d4a4650048e81e2e7aa1d48d7e89b25a4006c12a6d0e1a1568beafdcd5bf11da4bb5e8046c94109be3a5bf8401f607d01c8118556f8d24c45481832623945ecd',
}

// real tx from testnet bitcoin
// tx source: https://live.blockcypher.com/btc-testnet/tx/3025bd85d0b4473171c2269c9a7c3c663168e5f2b7bd4e51fb316927584ed59e/
rightProof = {
  version: '0x02000000',
  tx: '0x02000000000101e11812511b34dc3099e8c3095a15a2d597c4d9584b5bf0d744f239a1d25e03cf01000000171600141bc73fec67b4af381538673b52c92e796de0ae04feffffff02684200000000000016001452441f867942deb3581fa0dc795662c67cedb59448e1d9c701000000160014f17db91e9e0d6e70be7cd5729c4e065902cfac3a02473044022017ff2096ac0b1b626eedcb332dbfd925322e0f05c627e5e5309d95cafcde37360220403459e31e90b69ec6804bc82bc7d24ed5d0f6fa1a06ef000ff88aec34c31b540121028e7995c2f836ee56e3036423f8b6a7fd362d950a96de306ee94d0efec66f4e47b56f1800',
  txIndexInBlock: 1,
  bitcoinHeaders: '0x00000020e132a0c6c3d18b33005f29a39210b14d7ce7dafd167dff42a1fa000000000000ced28805534d831504038dab205ac31cb9627deaaba1d02b46ccae0392c75f53d6babb5dffff001b068f803c000040203b14957684aff3272d47de8ee8df2bf21faa729996baffb51d6d000000000000a5afde3105a5e0b72070cd109396bf4f74f74a59c3fb29df65cc3e1a006e7946b4babb5dffff001bbc528937',
  txInputVector:
   '0x01e11812511b34dc3099e8c3095a15a2d597c4d9584b5bf0d744f239a1d25e03cf01000000171600141bc73fec67b4af381538673b52c92e796de0ae04feffffff',
  txOutputVector:
   '0x02684200000000000016001452441f867942deb3581fa0dc795662c67cedb59448e1d9c701000000160014f17db91e9e0d6e70be7cd5729c4e065902cfac3a',
  txLocktime: '0xb56f1800',
  merkleProof:
   '0xc737b0b3470e8356d6d69cabdcca441ace6dda3bac3b0b005b2f763ac72b0438ec7600227acaa5c112edb57ef0af05d2cecd49dfa8447ee4c4279d9602c0fe5fd4a4650048e81e2e7aa1d48d7e89b25a4006c12a6d0e1a1568beafdcd5bf11da4bb5e8046c94109be3a5bf8401f607d01c8118556f8d24c45481832623945ecd',
}

