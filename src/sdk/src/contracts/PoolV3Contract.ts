import {
  Address,
  beginCell,
  Cell,
  Dictionary,
  DictionaryValue,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';
import { ContractOpcodes } from './opCodes';
import { packJettonOnchainMetadata } from './common/jettonContent';

/** Inital data structures and settings **/
export type PoolV3ContractConfig = {
  router_address: Address;

  lp_fee_base: number;
  protocol_fee: number;

  jetton0_wallet: Address;
  jetton1_wallet: Address;

  tick_spacing: number;

  pool_active: boolean;
  tick: number;
  price_sqrt: bigint;
  liquidity: bigint;
  lp_fee_current: number;

  accountv3_code: Cell;
  position_nftv3_code: Cell;

  //nftv3_content? : Cell;
};

export class TickInfoWrapper {
  constructor(
    public liquidityGross: bigint = 0n,
    public liquidityNet: bigint = 0n,
    public outerFeeGrowth0Token: bigint = 0n,
    public outerFeeGrowth1Token: bigint = 0n
  ) {}
}

const DictionaryTickInfo: DictionaryValue<TickInfoWrapper> = {
  serialize(src, builder) {
    builder.storeUint(src.liquidityGross, 256);
    builder.storeInt(src.liquidityNet, 128);
    builder.storeUint(src.outerFeeGrowth0Token, 256);
    builder.storeUint(src.outerFeeGrowth1Token, 256);
  },
  parse(src) {
    const tickInfo = new TickInfoWrapper();
    tickInfo.liquidityGross = src.loadUintBig(256);
    tickInfo.liquidityNet = src.loadIntBig(128);
    tickInfo.outerFeeGrowth0Token = src.loadUintBig(256);
    tickInfo.outerFeeGrowth1Token = src.loadUintBig(256);
    return tickInfo;
  },
};

const nftContentToPack: { [s: string]: string | undefined } = {
  name: 'AMM Pool Minter',
  description: 'AMM Pool LP Minter',
  uri: '',
  image: 'https://pimenovalexander.github.io/resources/icons/NFT.png',
};
const nftContentPacked: any = packJettonOnchainMetadata(nftContentToPack);

const nftItemContentToPack: { [s: string]: string | undefined } = {
  name: 'AMM Pool Position',
  description: 'LP Position',
  content_url: 'https://pimenovalexander.github.io/resources/icons/NFTItem.png',
  image: 'https://pimenovalexander.github.io/resources/icons/NFTItem.png',
};
const nftItemContentPacked: any =
  packJettonOnchainMetadata(nftItemContentToPack);

export function poolv3ContractConfigToCell(config: PoolV3ContractConfig): Cell {
  const ticks = Dictionary.empty(Dictionary.Keys.Int(24), DictionaryTickInfo);

  return beginCell()
    .storeAddress(config.router_address)
    .storeUint(config.lp_fee_base, 16)
    .storeUint(config.protocol_fee, 16)
    .storeAddress(config.jetton0_wallet)
    .storeAddress(config.jetton1_wallet)
    .storeUint(config.tick_spacing, 24)

    .storeRef(
      beginCell()
        .storeUint(0n, 256) // poolv3::feeGrowthGlobal0X128
        .storeUint(0n, 256) // poolv3::feeGrowthGlobal1X128
        .storeUint(0n, 128) // poolv3::collectedProtocolFee0
        .storeUint(0n, 128) // poolv3::collectedProtocolFee1
        .endCell()
    )

    .storeRef(
      beginCell()
        .storeUint(config.pool_active ? 1 : 0, 1)
        .storeInt(config.tick, 24)
        .storeUint(config.price_sqrt, 160)
        .storeUint(config.liquidity, 128)
        .storeUint(config.lp_fee_current, 16)

        .storeUint(0, 64) // NFT Inital counter

        .storeRef(nftContentPacked)
        .storeRef(nftItemContentPacked)
        .endCell()
    )
    .storeRef(beginCell().storeDict(ticks).endCell())
    .storeRef(
      beginCell()
        .storeRef(config.accountv3_code)
        .storeRef(config.position_nftv3_code)
        .endCell()
    )
    .endCell();
}

/** Pool  **/
export class PoolV3Contract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(
    config: PoolV3ContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = poolv3ContractConfigToCell(config);
    // console.log(data);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new PoolV3Contract(address, init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  /** Internal message wrappers **/
  async sendInit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    recipient: Address,
    sqrtPriceX96: bigint
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.POOLV3_INIT, 32) // OP code
      .storeAddress(recipient)
      .storeUint(sqrtPriceX96, 160)
      .storeRef(nftContentPacked)
      .storeRef(nftItemContentPacked)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendSetFees(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    protocolFee: number,
    lpFee: number,
    currentFee: number
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.POOLV3_SET_FEE, 32) // OP code
      .storeUint(protocolFee, 16)
      .storeUint(lpFee, 16)
      .storeUint(currentFee, 16)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendMintDebug(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    recipient: Address,
    tickLower: number,
    tickUpper: number,
    liquidity: bigint
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.POOLV3_MINT_M, 32) // OP code
      .storeAddress(recipient)
      .storeInt(tickLower, 24)
      .storeInt(tickUpper, 24)
      .storeInt(liquidity, 128)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendBurnDebug(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    recipient: Address,
    tickLower: number,
    tickUpper: number,
    liquidity: bigint
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.POOLV3_BURN_M, 32) // OP code
      .storeAddress(recipient)
      .storeInt(tickLower, 24)
      .storeInt(tickUpper, 24)
      .storeInt(liquidity, 128)

      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendSwapDebug(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    recipient: Address,
    zeroForOne: boolean,
    amountSpecified: bigint,
    sqrtPriceLimitX96: bigint
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.POOLV3_SWAP_M, 32) // OP code
      .storeAddress(recipient)
      .storeUint(zeroForOne ? 1 : 0, 1)
      .storeUint(amountSpecified, 256)
      .storeUint(sqrtPriceLimitX96, 160)

      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  /** Getters **/

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return {
      number: stack.readNumber(),
    };
  }

  async getIsActive(provider: ContractProvider) {
    const { stack } = await provider.get('getIsActive', []);
    return stack.readBoolean();
  }

  async getName(provider: ContractProvider) {
    const { stack } = await provider.get('getName', []);
    return stack.readString();
  }

  async getFees(provider: ContractProvider) {
    const { stack } = await provider.get('getFees', []);
    return {
      lp_fee_base: stack.readNumber(),
      protocol_fee: stack.readNumber(),
      lp_fee_current: stack.readNumber(),
    };
  }

  async getTokenAddresses(provider: ContractProvider) {
    const { stack } = await provider.get('getTokenAddresses', []);
    return {
      jetton0_wallet: stack.readAddress(),
      jetton1_wallet: stack.readAddress(),
    };
  }

  async getPriceAndLiquidity(provider: ContractProvider) {
    const { stack } = await provider.get('getPriceAndLiquidity', []);

    const priceSqrt: bigint = stack.readBigNumber();
    const liquidity: bigint = stack.readBigNumber();
    console.log('  contract data : ', priceSqrt, ' ', liquidity);
    return {
      priceSqrt,
      liquidity,
    };
  }

  async getTick(provider: ContractProvider) {
    const { stack } = await provider.get('getTick', []);
    return stack.readNumber();
  }

  async getPoolStateAndConfiguration(provider: ContractProvider) {
    const { stack } = await provider.get('getPoolStateAndConfiguration', []);

    return {
      router_address: stack.readAddress(),
      jetton0_wallet: stack.readAddress(),
      jetton1_wallet: stack.readAddress(),
      pool_active: stack.readBoolean(),
      tick_spacing: stack.readNumber(),

      lp_fee_base: stack.readNumber(),
      protocol_fee: stack.readNumber(),
      lp_fee_current: stack.readNumber(),

      tick: stack.readNumber(),
      price_sqrt: stack.readBigNumber(),
      liquidity: stack.readBigNumber(),

      feeGrowthGlobal0X128: stack.readBigNumber(),
      feeGrowthGlobal1X128: stack.readBigNumber(),
      collectedProtocolFee0: stack.readBigNumber(),
      collectedProtocolFee1: stack.readBigNumber(),

      nftv3item_counter: stack.readNumber(),
    };
  }

  /* Tick related getters */
  async getTickMinMax(provider: ContractProvider) {
    const { stack } = await provider.get('getTickMinMax', []);
    return {
      minTickNum: stack.readNumber(),
      maxTickNum: stack.readNumber(),
    };
  }

  /**
   *  Returns a tick by tickNumber. If tick not inited - tick filled with zero will be returned.
   *  Also pervious tick and next tick numbers are returned
   *
   *
   *  @param provider   blockchain access provider
   *  @param tickNumber Tick to extract data for
   *
   **/
  async getTickInfo(provider: ContractProvider, tickNumber: number) {
    const { stack } = await provider.get('getTickInfoByKey', [
      { type: 'int', value: BigInt(tickNumber) },
    ]);

    const tickInfo = new TickInfoWrapper();

    tickInfo.liquidityGross = stack.readBigNumber();
    tickInfo.liquidityNet = stack.readBigNumber();
    tickInfo.outerFeeGrowth0Token = stack.readBigNumber();
    tickInfo.outerFeeGrowth1Token = stack.readBigNumber();
    return {
      tick: tickInfo,
      prevTick: stack.readNumber(),
      nextTick: stack.readNumber(),
    };
  }

  async getTickKeysFrom(
    provider: ContractProvider,
    tickNumber: number,
    amount: number
  ) {
    const { stack } = await provider.get('getTickKeysFrom', [
      { type: 'int', value: BigInt(tickNumber) },
      { type: 'int', value: BigInt(amount) },
    ]);

    const reader = stack.readTuple();
    const result = [];

    while (reader.remaining) result.push(reader.readNumber());

    return result;
  }

  /**
   *  Returns a hash object of ticks infos with all internal data starting from key >=tickNumber  or key <= tickNumber
   *  and no more then number. Unfortunataly there is an internal limit of 255 tickInfos
   *
   *
   *  @param provider   blockchain access provider
   *  @param tickNumber Starting tick. Ticks greater or equal will be returned with back == false, with back == true - less or equal keys will be enumerated
   *  @param amount     Number of tick infos to be returned
   *  @param back       directions of ticks
   *
   **/
  async getTickInfosFrom(
    provider: ContractProvider,
    tickNumber: number,
    amount: number,
    back: boolean = false
  ) {
    const { stack } = await provider.get(
      back ? 'getTickInfosBackFrom' : 'getTickInfosFrom',
      [
        { type: 'int', value: BigInt(tickNumber) },
        { type: 'int', value: BigInt(amount) },
      ]
    );

    const keyReader = stack.readTuple();
    const valueReader = stack.readTuple();

    // console.log(valueReader);

    const result: { [key: number]: TickInfoWrapper } = {};

    while (keyReader.remaining && valueReader.remaining) {
      const infoTuple = valueReader.readTuple();
      const tickInfo = new TickInfoWrapper(
        infoTuple.readBigNumber(),
        infoTuple.readBigNumber(),
        infoTuple.readBigNumber(),
        infoTuple.readBigNumber()
      );
      result[keyReader.readNumber()] = tickInfo;
    }

    return result;
  }

  async getSwapEstimate(
    provider: ContractProvider,
    zeroForOne: boolean,
    amount: bigint,
    sqrtPriceLimitX96: bigint
  ) {
    const { stack } = await provider.get('getSwapEstimate', [
      { type: 'int', value: BigInt(zeroForOne ? 1 : 0) },
      { type: 'int', value: BigInt(amount) },
      { type: 'int', value: BigInt(sqrtPriceLimitX96) },
    ]);
    return { amount0: stack.readBigNumber(), amount1: stack.readBigNumber() };
  }

  /* Tick math related getters */
  async getSqrtRatioAtTick(provider: ContractProvider, tick: number) {
    const { stack } = await provider.get('getSqrtRatioAtTick', [
      { type: 'int', value: BigInt(tick) },
    ]);
    return stack.readBigNumber();
  }

  async getTickAtSqrtRatio(provider: ContractProvider, sqrtPriceX96: bigint) {
    const { stack } = await provider.get('getTickAtSqrtRatio', [
      { type: 'int', value: BigInt(sqrtPriceX96) },
    ]);
    return stack.readNumber();
  }

  async getMaxLiquidityPerTick(provider: ContractProvider) {
    const { stack } = await provider.get('getMaxLiquidityPerTick', []);
    return stack.readBigNumber();
  }

  async getTickSpacingToMaxLiquidityPerTick(
    provider: ContractProvider,
    tickSpacing: number
  ) {
    const { stack } = await provider.get(
      'getTickSpacingToMaxLiquidityPerTick',
      [{ type: 'int', value: BigInt(tickSpacing) }]
    );
    return stack.readNumber();
  }

  /* Subcontracts getters */
  async getUserAccountAddress(
    provider: ContractProvider,
    owner: Address
  ): Promise<Address> {
    const res = await provider.get('getUserAccountAddress', [
      { type: 'slice', cell: beginCell().storeAddress(owner).endCell() },
    ]);
    return res.stack.readAddress();
  }

  async getNFTAddressByIndex(
    provider: ContractProvider,
    index: bigint
  ): Promise<Address> {
    const res = await provider.get('get_nft_address_by_index', [
      { type: 'int', value: BigInt(index) },
    ]);
    return res.stack.readAddress();
  }

  /* Math for testing only */
  async getMostSignificantBit(provider: ContractProvider, x: bigint) {
    const { stack } = await provider.get('getMostSignificantBit', [
      { type: 'int', value: BigInt(x) },
    ]);
    return stack.readNumber();
  }

  async getAmount0Delta(
    provider: ContractProvider,
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint
  ) {
    const { stack } = await provider.get('getAmount0Delta', [
      { type: 'int', value: BigInt(sqrtRatioAX96) },
      { type: 'int', value: BigInt(sqrtRatioBX96) },
      { type: 'int', value: BigInt(liquidity) },
    ]);
    return stack.readBigNumber();
  }

  async getAmount1Delta(
    provider: ContractProvider,
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint
  ) {
    const { stack } = await provider.get('getAmount1Delta', [
      { type: 'int', value: BigInt(sqrtRatioAX96) },
      { type: 'int', value: BigInt(sqrtRatioBX96) },
      { type: 'int', value: BigInt(liquidity) },
    ]);
    return stack.readBigNumber();
  }

  /* Rounding versions */
  async getAmount0DeltaR(
    provider: ContractProvider,
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ) {
    const { stack } = await provider.get('getAmount0DeltaR', [
      { type: 'int', value: BigInt(sqrtRatioAX96) },
      { type: 'int', value: BigInt(sqrtRatioBX96) },
      { type: 'int', value: BigInt(liquidity) },
      { type: 'int', value: BigInt(roundUp ? 1 : 0) },
    ]);
    return stack.readBigNumber();
  }

  async getAmount1DeltaR(
    provider: ContractProvider,
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ) {
    const { stack } = await provider.get('getAmount1DeltaR', [
      { type: 'int', value: BigInt(sqrtRatioAX96) },
      { type: 'int', value: BigInt(sqrtRatioBX96) },
      { type: 'int', value: BigInt(liquidity) },
      { type: 'int', value: BigInt(roundUp ? 1 : 0) },
    ]);
    return stack.readBigNumber();
  }

  /* Sqrt Math related computation */
  async getNextSqrtPriceFromAmount0RoundingUp(
    provider: ContractProvider,
    sqrtPX96: bigint,
    liquidity: bigint,
    amount: bigint,
    add: boolean
  ) {
    const { stack } = await provider.get(
      'getNextSqrtPriceFromAmount0RoundingUp',
      [
        { type: 'int', value: BigInt(sqrtPX96) },
        { type: 'int', value: BigInt(liquidity) },
        { type: 'int', value: BigInt(amount) },
        { type: 'int', value: BigInt(add ? 1 : 0) },
      ]
    );
    return stack.readBigNumber();
  }

  async getNextSqrtPriceFromAmount1RoundingDown(
    provider: ContractProvider,
    sqrtPX96: bigint,
    liquidity: bigint,
    amount: bigint,
    add: boolean
  ) {
    const { stack } = await provider.get(
      'getNextSqrtPriceFromAmount1RoundingDown',
      [
        { type: 'int', value: BigInt(sqrtPX96) },
        { type: 'int', value: BigInt(liquidity) },
        { type: 'int', value: BigInt(amount) },
        { type: 'int', value: BigInt(add ? 1 : 0) },
      ]
    );
    return stack.readBigNumber();
  }

  async getNextSqrtPriceFromInput(
    provider: ContractProvider,
    sqrtPX96: bigint,
    liquidity: bigint,
    amountIn: bigint,
    zeroForOne: boolean
  ) {
    const { stack } = await provider.get('getNextSqrtPriceFromInput', [
      { type: 'int', value: BigInt(sqrtPX96) },
      { type: 'int', value: BigInt(liquidity) },
      { type: 'int', value: BigInt(amountIn) },
      { type: 'int', value: BigInt(zeroForOne ? 1 : 0) },
    ]);
    return stack.readBigNumber();
  }

  async getNextSqrtPriceFromOutput(
    provider: ContractProvider,
    sqrtPX96: bigint,
    liquidity: bigint,
    amountOut: bigint,
    zeroForOne: boolean
  ) {
    const { stack } = await provider.get('getNextSqrtPriceFromOutput', [
      { type: 'int', value: BigInt(sqrtPX96) },
      { type: 'int', value: BigInt(liquidity) },
      { type: 'int', value: BigInt(amountOut) },
      { type: 'int', value: BigInt(zeroForOne ? 1 : 0) },
    ]);
    return stack.readBigNumber();
  }

  /* Main swap math */
  async getComputeSwapStep(
    provider: ContractProvider,
    sqrtRatioCurrentX96: bigint,
    sqrtRatioTargetX96: bigint,
    liquidity: bigint,
    amountRemaining: bigint,
    feePips: bigint
  ) {
    const { stack } = await provider.get('computeSwapStep', [
      { type: 'int', value: BigInt(sqrtRatioCurrentX96) },
      { type: 'int', value: BigInt(sqrtRatioTargetX96) },
      { type: 'int', value: BigInt(liquidity) },
      { type: 'int', value: BigInt(amountRemaining) },
      { type: 'int', value: BigInt(feePips) },
    ]);
    return {
      sqrtRatioNextX96: stack.readBigNumber(),
      amountIn: stack.readBigNumber(),
      amountOut: stack.readBigNumber(),
      feeAmount: stack.readBigNumber(),
    };
  }
}
