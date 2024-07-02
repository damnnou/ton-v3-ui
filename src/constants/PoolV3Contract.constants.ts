import * as fs from "fs";
import crc from "crc";

export class PoolV3ContractConstants {
    private static instance: PoolV3ContractConstants;

    private errors: { [key: string]: number };
    private methods: { [key: string]: number };

    constructor() {
        // console.log("Loading constants")

        this.errors = {};
        this.methods = {};

        try {
            // Loading error constants
            let data = fs.readFileSync("contracts/poolv3/errors.func", "utf-8");
            let lines = data.split("\n");

            for (const line of lines) {
                const trimmedLine = line.trim();

                // Ignore lines that start with a semicolon
                if (trimmedLine.startsWith(";;") || trimmedLine === "") {
                    continue;
                }

                const match = trimmedLine.match(/^(\w+)\s+(\w+)\s+(\w+)\s*=\s*(.*);$/);
                if (match) {
                    const [, modifier, type, name, value] = match;
                    this.errors[name] = Number(value);
                }
            }

            // Loading method names
            data = fs.readFileSync("contracts/poolv3/constants.func", "utf-8");
            lines = data.split("\n");

            for (const line of lines) {
                const trimmedLine = line.trim();

                // Ignore lines that start with a semicolon
                if (trimmedLine.startsWith(";;") || trimmedLine === "") {
                    continue;
                }

                // Example: const OPERATION_SWAP = "swap"c;

                const match = trimmedLine.match(/^(\w+)\s+OPERATION_(\w+)\s*=\s*"(.*)"c;$/);
                if (match) {
                    const [, modifier, name, textual] = match;
                    this.methods[name] = crc.crc32(textual);
                }
            }
        } catch (err) {
            console.error(`Error reading file: ${err}`);
        }
    }

    public static getInstance(): PoolV3ContractConstants {
        if (!PoolV3ContractConstants.instance) {
            PoolV3ContractConstants.instance = new PoolV3ContractConstants();
        }
        return PoolV3ContractConstants.instance;
    }

    public static getErrors() {
        return PoolV3ContractConstants.getInstance().errors;
    }

    public static getMethods() {
        return PoolV3ContractConstants.getInstance().methods;
    }
}
