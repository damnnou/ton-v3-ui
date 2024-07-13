import { Cell } from "@ton/core";
import { displayContentCell } from "src/sdk/src/contracts/common/jettonContent";
import { Jetton } from "src/sdk/src/entities/Jetton";

export async function parseJettonContent(jettonMinterAddress: string, content: Cell): Promise<Jetton> {
    const jettonMetadata = await displayContentCell(content);

    if (!jettonMetadata) throw new Error("Jetton metadata not found");

    return new Jetton(
        jettonMinterAddress,
        Number(jettonMetadata.decimals),
        jettonMetadata.symbol,
        jettonMetadata.name,
        jettonMetadata.image
    );
}
