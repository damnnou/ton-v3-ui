import {
  Address,
  beginCell,
  Builder,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/core';
import { ContractOpcodes } from './opCodes';

/** Inital data structures and settings **/
export type PositionNFTV3ContractConfig = {
  poolAddress: Address;
  userAddress: Address;

  liquidity: bigint;
  tickLow: number;
  tickHigh: number;
};

export function positionNFTv3ContractConfigToCell(
  config: PositionNFTV3ContractConfig
): Cell {
  return beginCell()
    .storeAddress(config.poolAddress)
    .storeAddress(config.userAddress)
    .storeUint(config.liquidity, 128)
    .storeInt(config.tickLow, 24)
    .storeInt(config.tickHigh, 24)
    .endCell();
}

export class PositionNFTV3Contract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(
    config: PositionNFTV3ContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = positionNFTv3ContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);
    return new PositionNFTV3Contract(address, init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  /* TODO: This method is for debug only.
   *  We will have multiple pools identified by two tokens.
   *  But so far we use only one pool, so we provide the way to set the pool address.
   *
   **/
  async sendInit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,

    poolAddress: Address
  ) {
    const msg_body = beginCell()
      .storeUint(ContractOpcodes.ROUTERV3_SET_POOL, 32) // OP code
      .storeAddress(poolAddress)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    params: {
      value?: bigint;
      to: Address;
      responseTo?: Address;
      forwardAmount?: bigint;
      forwardBody?: Cell | Builder;
    }
  ) {
    await provider.internal(via, {
      value: params.value ?? toNano('0.05'),
      body: beginCell()
        .storeUint(ContractOpcodes.POSITIONNFTV3_TRANSFER, 32) // op
        .storeUint(0, 64) // query id
        .storeAddress(params.to)
        .storeAddress(params.responseTo)
        .storeBit(false) // custom payload
        .storeCoins(params.forwardAmount ?? 0n)
        .storeMaybeRef(params.forwardBody)
        .endCell(),
    });
  }

  async sendBurn(
    provider: ContractProvider,
    via: Sender,
    params: {
      value?: bigint;
    }
  ) {
    await provider.internal(via, {
      value: params.value ?? toNano('0.05'),
      body: beginCell()
        .storeUint(ContractOpcodes.POSITIONNFTV3_BURN, 32) // op
        .storeUint(0, 64) // query id
        .endCell(),
    });
  }

  /** Getters **/
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return { number: stack.readNumber() };
  }

  async getUserAddress(provider: ContractProvider): Promise<Address> {
    const { stack } = await provider.get('getUserAddress', []);
    return stack.readAddress();
  }

  async getPoolAddress(provider: ContractProvider): Promise<Address> {
    const { stack } = await provider.get('getPoolAddress', []);
    return stack.readAddress();
  }

  async getPositionInfo(provider: ContractProvider) {
    const { stack } = await provider.get('getPositionInfo', []);
    return {
      liquidity: stack.readBigNumber(),
      tickLow: stack.readNumber(),
      tickHigh: stack.readNumber(),
    };
  }

  /* TODO: Should I use inheritance? */
  async getData(provider: ContractProvider) {
    const { stack } = await provider.get('get_nft_data', []);
    return {
      inited: stack.readBoolean(),
      index: stack.readNumber(),
      collection: stack.readAddressOpt(),
      owner: stack.readAddressOpt(),
      content: stack.readCellOpt(),
    };
  }
}
