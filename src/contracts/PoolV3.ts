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
} from "ton-core";
import { PoolV3ContractConstants } from "src/constants/PoolV3Contract.constants";

/** Operation ids **/
/** TODO: USE PoolV3Conract.constants.ts **/

//const OPERATION_SWAP : number = 0x25938561;
//const OPERATION_MINT : number = 0x0318f361;
//const OPERATION_BURN : number = 0x55521d04;
//const OPERATION_COLLECT : number = 0xa40662f4;

/** Inital data structures and settings **/
export type PoolV3ContractConfig = {
    router_address: Address;

    lp_fee_base: number;
    protocol_fee: number;

    token0_address: Address;
    token1_address: Address;

    tick_spacing: number;

    pool_active: boolean;
    tick: number;
    price_sqrt: bigint;
    liquidity: bigint;
    lp_fee_current: number;
};

export class TickInfoWrapper {
    constructor(
        public liquidityGross: bigint = 0n,
        public liquidity_delta: bigint = 0n,
        public outerFeeGrowth0Token: bigint = 0n,
        public outerFeeGrowth1Token: bigint = 0n
    ) {}
}

const DictionaryTickInfo: DictionaryValue<TickInfoWrapper> = {
    serialize(src, builder) {
        builder.storeUint(src.liquidityGross, 256);
        builder.storeInt(src.liquidity_delta, 128);
        builder.storeUint(src.outerFeeGrowth0Token, 256);
        builder.storeUint(src.outerFeeGrowth1Token, 256);
    },
    parse(src) {
        let tickInfo = new TickInfoWrapper();
        tickInfo.liquidityGross = src.loadUintBig(256);
        tickInfo.liquidity_delta = src.loadIntBig(128);
        tickInfo.outerFeeGrowth0Token = src.loadUintBig(256);
        tickInfo.outerFeeGrowth1Token = src.loadUintBig(256);
        return tickInfo;
    },
};

export function poolv3ContractConfigToCell(config: PoolV3ContractConfig): Cell {
    let ticks = Dictionary.empty(Dictionary.Keys.Int(24), DictionaryTickInfo);

    return beginCell()
        .storeAddress(config.router_address)
        .storeUint(config.lp_fee_base, 16)
        .storeUint(config.protocol_fee, 16)
        .storeAddress(config.token0_address)
        .storeAddress(config.token1_address)
        .storeUint(config.tick_spacing, 24)
        .storeRef(
            beginCell()
                .storeUint(config.pool_active ? 1 : 0, 1)
                .storeInt(config.tick, 24)
                .storeUint(config.price_sqrt, 160)
                .storeUint(config.liquidity, 128)
                .storeUint(config.lp_fee_current, 16)
                .endCell()
        )
        .storeRef(beginCell().storeDict(ticks).endCell())
        .endCell();
}

/** Pool  **/
export class PoolV3Contract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromConfig(config: PoolV3ContractConfig, code: Cell, workchain = 0) {
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
            .storeUint(PoolV3ContractConstants.getMethods()["INIT"], 32) // OP code
            .storeAddress(recipient)
            .storeUint(sqrtPriceX96, 160)
            .endCell();

        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: msg_body });
    }

    async sendMint(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,

        recipient: Address,
        tickLower: number,
        tickUpper: number,
        liquidity: bigint
    ) {
        const msg_body = beginCell()
            .storeUint(PoolV3ContractConstants.getMethods()["MINT"], 32) // OP code
            .storeAddress(recipient)
            .storeInt(tickLower, 24)
            .storeInt(tickUpper, 24)
            .storeInt(liquidity, 128)
            .endCell();

        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: msg_body });
    }

    async sendBurn(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,

        recipient: Address,
        tickLower: number,
        tickUpper: number,
        liquidity: bigint
    ) {
        const msg_body = beginCell()
            .storeUint(PoolV3ContractConstants.getMethods()["BURN"], 32) // OP code
            .storeAddress(recipient)
            .storeInt(tickLower, 24)
            .storeInt(tickUpper, 24)
            .storeInt(liquidity, 128)

            .endCell();

        await provider.internal(sender, { value, sendMode: SendMode.PAY_GAS_SEPARATELY, body: msg_body });
    }

    /** Getters **/

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("balance", []);
        return {
            number: stack.readNumber(),
        };
    }

    async getFees(provider: ContractProvider) {
        const { stack } = await provider.get("getFees", []);
        return {
            lp_fee_base: stack.readNumber(),
            protocol_fee: stack.readNumber(),
            lp_fee_current: stack.readNumber(),
        };
    }

    async getTokenAddresses(provider: ContractProvider) {
        const { stack } = await provider.get("getTokenAddresses", []);
        return {
            token0_address: stack.readAddress(),
            token1_address: stack.readAddress(),
        };
    }

    async getPriceAndLiquidity(provider: ContractProvider) {
        const { stack } = await provider.get("getPriceAndLiquidity", []);

        let priceSqrt: bigint = stack.readBigNumber();
        let liquidity: bigint = stack.readBigNumber();
        console.log("  contract data : ", priceSqrt, " ", liquidity);

        let token0Decimals: bigint = 9n;
        let token1Decimals: bigint = 9n;
        //    let q96 : bigint = 2n ** 96n;
        //    let rPriceSqrt = (priceSqrt / q96 * 10n**((token0Decimals - token1Decimals) / 2n));

        //   console.log("  Reduced price : ", rPriceSqrt ** 2n);

        //    let rL = liquidity / 10n**((token1Decimals + token0Decimals) / 2n );

        //    console.log("  Reduced liquidity :", rL);

        //    console.log("  Virtual Reserves :");
        //    console.log("    token0 ", rL / rPriceSqrt);
        //    console.log("    token1 ", rL * rPriceSqrt);

        return {
            priceSqrt,
            liquidity,
        };
    }

    async getTick(provider: ContractProvider) {
        const { stack } = await provider.get("getTick", []);
        let tick: number = stack.readNumber();
        return tick;
    }

    /* Tick related getters */
    async getTickMinMax(provider: ContractProvider) {
        const { stack } = await provider.get("getTickMinMax", []);
        return {
            minTickNum: stack.readBigNumber(),
            maxTickNum: stack.readBigNumber(),
        };
    }

    async getTickInfo(provider: ContractProvider, tickNumber: number) {
        const { stack } = await provider.get("getTickInfoByKey", [{ type: "int", value: BigInt(tickNumber) }]);

        let tickInfo = new TickInfoWrapper();

        tickInfo.liquidityGross = stack.readBigNumber();
        tickInfo.liquidity_delta = stack.readBigNumber();
        tickInfo.outerFeeGrowth0Token = stack.readBigNumber();
        tickInfo.outerFeeGrowth1Token = stack.readBigNumber();
        return { tick: tickInfo, prevTick: stack.readNumber(), nextTick: stack.readNumber() };
    }

    async getTickKeysFrom(provider: ContractProvider, tickNumber: number, amount: number) {
        const { stack } = await provider.get("getTickKeysFrom", [
            { type: "int", value: BigInt(tickNumber) },
            { type: "int", value: BigInt(amount) },
        ]);

        let reader = stack.readTuple();
        let result = [];

        while (reader.remaining) result.push(reader.readNumber());

        return result;
    }

    async getTickInfosFrom(provider: ContractProvider, tickNumber: number, amount: number) {
        const { stack } = await provider.get("getTickInfosFrom", [
            { type: "int", value: BigInt(tickNumber) },
            { type: "int", value: BigInt(amount) },
        ]);

        let keyReader = stack.readTuple();
        let valueReader = stack.readTuple();

        // console.log(valueReader);

        let result: { [key: number]: TickInfoWrapper } = {};

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

    /* Tick math related getters */
    async getSqrtRatioAtTick(provider: ContractProvider, tick: number) {
        const { stack } = await provider.get("getSqrtRatioAtTick", [{ type: "int", value: BigInt(tick) }]);
        return stack.readBigNumber();
    }

    async getTickAtSqrtRatio(provider: ContractProvider, sqrtPriceX96: bigint) {
        const { stack } = await provider.get("getTickAtSqrtRatio", [{ type: "int", value: BigInt(sqrtPriceX96) }]);
        return stack.readNumber();
    }

    async getMaxLiquidityPerTick(provider: ContractProvider) {
        const { stack } = await provider.get("getMaxLiquidityPerTick", []);
        return stack.readBigNumber();
    }

    async getTickSpacingToMaxLiquidityPerTick(provider: ContractProvider, tickSpacing: number) {
        const { stack } = await provider.get("getTickSpacingToMaxLiquidityPerTick", [{ type: "int", value: BigInt(tickSpacing) }]);
        return stack.readNumber();
    }

    /* Math for testing only */
    async getMostSignificantBit(provider: ContractProvider, x: bigint) {
        const { stack } = await provider.get("getMostSignificantBit", [{ type: "int", value: BigInt(x) }]);
        return stack.readNumber();
    }

    async getAmount0Delta(provider: ContractProvider, sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint) {
        const { stack } = await provider.get("getAmount0Delta", [
            { type: "int", value: BigInt(sqrtRatioAX96) },
            { type: "int", value: BigInt(sqrtRatioBX96) },
            { type: "int", value: BigInt(liquidity) },
        ]);
        return stack.readBigNumber();
    }

    async getAmount1Delta(provider: ContractProvider, sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint) {
        const { stack } = await provider.get("getAmount1Delta", [
            { type: "int", value: BigInt(sqrtRatioAX96) },
            { type: "int", value: BigInt(sqrtRatioBX96) },
            { type: "int", value: BigInt(liquidity) },
        ]);
        return stack.readBigNumber();
    }
}
