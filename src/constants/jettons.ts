import { Jetton } from "src/sdk/src/entities/Jetton";

export type Jettons = {
    [symbol: string]: Jetton;
};

export const jettons: Jettons = {
    ALG_USD: new Jetton(
        "EQD8Hzc0JD808OAnCsnCea2_Fq4cNAiAhGo5KaXM-zt8HV5Q",
        9,
        "ALG_USD",
        "Algebra USD",
        "https://cache.tonapi.io/imgproxy/bkEXt0iMIllDAwZ49yeipCc43WGmLgTwqvnAluEkyuE/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvQUxHX1VTRC5wbmc.webp"
    ),
    ALG_ETH: new Jetton(
        "EQACEhh_dJzp3PPyEwwTfTy7Ub_f6Dt5FAKZq_t1Fqe2vaL2",
        9,
        "ALG_ETH",
        "Algebra ETH",
        "https://cache.tonapi.io/imgproxy/dOGRKCpepjByFEhB222wY5f8Ccne2AUmbTyz1jn5tz4/rs:fill:200:200:1/g:no/aHR0cHM6Ly9waW1lbm92YWxleGFuZGVyLmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbnMvQUxHX0VUSC5wbmc.webp"
    ),
};
