import { Api, HttpClient } from "tonapi-sdk-js";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

const API_KEY = "AFWGG4WGTYW3K2YAAAAKYZV76ERL7GNMX5URCRCFSMDCYSAHOBGWCL3JXDQNCLSUXMPXD5Q";

export function useTonConsoleClient() {
    const { network } = useTonConnect();

    return useAsyncInitialize(async () => {
        const httpClient = new HttpClient({
            baseUrl: network === CHAIN.TESTNET ? "https://testnet.tonapi.io" : "https://tonapi.io",
            baseApiParams: {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-type": "application/json",
                },
            },
        });
        const tonConsoleClient = new Api(httpClient);

        return tonConsoleClient;
    }, [network]);
}
