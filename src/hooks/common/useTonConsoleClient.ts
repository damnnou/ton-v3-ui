import { Api, HttpClient } from "tonapi-sdk-js";

const API_KEY = "AFWGG4WGTYW3K2YAAAAKYZV76ERL7GNMX5URCRCFSMDCYSAHOBGWCL3JXDQNCLSUXMPXD5Q";

export function useTonConsoleClient() {
    const httpClient = new HttpClient({
        baseUrl: "https://testnet.tonapi.io",
        baseApiParams: {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-type": "application/json",
            },
        },
    });
    const tonConsoleClient = new Api(httpClient);

    return tonConsoleClient;
}
