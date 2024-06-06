import TonWeb from "tonweb";

const {
    token: {
        jetton: { JettonMinter: jettonMinter },
    },
} = TonWeb;

export const JettonMinter = jettonMinter;
