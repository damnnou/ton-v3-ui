import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";
import { ContractOpcodes } from "./opCodes";

/** Inital data structures and settings **/
export type RouterV3ContractConfig = {    
    active : boolean,
    adminAddress : Address,
    poolAddress : Address,
}


export function routerv3ContractConfigToCell(config: RouterV3ContractConfig): Cell {
    return beginCell()
        .storeUint(config.active ? 1 : 0, 1)
        .storeAddress(config.adminAddress)
        .storeAddress(config.poolAddress)
    .endCell()    
}


export class RouterV3Contract implements Contract {
    constructor(
      readonly address: Address,
      readonly init?: { code: Cell; data: Cell }
    ) {}
  
    static createFromConfig(
      config: RouterV3ContractConfig,
      code: Cell,
      workchain = 0
    ) {
      const data = routerv3ContractConfigToCell(config);
      const init = { code, data };
      const address = contractAddress(workchain, init);  
      return new RouterV3Contract(address, init);
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
        .storeUint(ContractOpcodes.POOLV3_SET_POOL, 32) // OP code
        .storeAddress(poolAddress)        
        .endCell();

      await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: msg_body });
    }



    /** Getters **/
    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("balance", []);
        return { number: stack.readNumber() };
    }

    async getName(provider: ContractProvider) {
      const { stack } = await provider.get("getName", []);
      return stack.readString();
    }

    async getIsLocked(provider: ContractProvider) : Promise<boolean> {
      const { stack } = await provider.get("getIsLocked", []);
      return stack.readBoolean();
    }

    async getAdminAddress(provider: ContractProvider) : Promise<Address> {
      const { stack } = await provider.get("getAdminAddress", []);
      return stack.readAddress();
    }
    
    async getPoolAddress(provider: ContractProvider) : Promise<Address> {
      const { stack } = await provider.get("getPoolAddress", []);
      return stack.readAddress();
    }

    
  
}