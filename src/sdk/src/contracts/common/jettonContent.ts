import {
  beginCell,
  Builder,
  Cell,
  Dictionary,
  DictionaryValue,
  Slice,
} from '@ton/core';
import { sha256 } from '@ton/crypto';

// TODO: In file
//   - Rework code doubling
//   - functions packing and unpacking 5 field structures should not be async
export const defaultJettonKeys = [
  'uri',
  'name',
  'description',
  'image',
  'image_data',
  'symbol',
  'decimals',
  'amount_style',
];
export const defaultNftKeys = [
  'uri',
  'name',
  'description',
  'image',
  'image_data',
];

export type JettonMetaDataKeys =
  | 'name'
  | 'description'
  | 'image'
  | 'symbol'
  | 'image_data'
  | 'decimals'
  | 'uri';

const jettonOnChainMetadataSpec: {
  [key in JettonMetaDataKeys]: 'utf8' | 'ascii' | undefined;
} = {
  name: 'utf8',
  description: 'utf8',
  image: 'ascii',
  decimals: 'utf8',
  symbol: 'utf8',
  image_data: undefined,
  uri: 'ascii',
};

const ONCHAIN_CONTENT_PREFIX = 0x00;
// const OFFCHAIN_CONTENT_PREFIX = 0x01;
// const SNAKE_PREFIX = 0x00;

const contentValue: DictionaryValue<string> = {
  serialize: (src: string, builder: Builder) => {
    builder.storeRef(
      beginCell().storeUint(0, 8).storeStringTail(src).endCell()
    );
  },
  parse: (src: Slice) => {
    const sc = src.loadRef().beginParse();
    const prefix = sc.loadUint(8);
    if (prefix == 0) {
      return sc.loadStringTail();
    } else if (prefix == 1) {
      // Not really tested, but feels like it should work
      const chunkDict = Dictionary.loadDirect(
        Dictionary.Keys.Uint(32),
        Dictionary.Values.Cell(),
        sc
      );
      return chunkDict
        .values()
        .map((x) => x.beginParse().loadStringTail())
        .join('');
    } else {
      throw Error(`Prefix ${prefix} is not supported yet`);
    }
  },
};

export async function displayContentCell(
  content: Cell,
  jetton: boolean = true,
  additional?: string[]
) {
  const cs = content.beginParse();
  const contentType = cs.loadUint(8);
  if (contentType == 1) {
    const noData = cs.remainingBits == 0;
    if (noData && cs.remainingRefs == 0) {
      console.log('No data in content cell!\n');
    } else {
      const contentUrl = noData ? cs.loadStringRefTail() : cs.loadStringTail();
      console.log(`Content metadata url:${contentUrl}\n`);
    }
  } else if (contentType == 0) {
    let contentKeys: string[];
    const hasAdditional = additional !== undefined && additional.length > 0;
    const contentDict = Dictionary.load(
      Dictionary.Keys.BigUint(256),
      contentValue,
      cs
    );
    const contentMap: { [key: string]: string } = {};

    if (jetton) {
      contentKeys = hasAdditional
        ? [...defaultJettonKeys, ...additional]
        : defaultJettonKeys;
    } else {
      contentKeys = hasAdditional
        ? [...defaultNftKeys, ...additional]
        : defaultNftKeys;
    }
    for (const name of contentKeys) {
      // I know we should pre-compute hashed keys for known values... just not today.
      const dictKey = BigInt('0x' + (await sha256(name)).toString('hex'));
      const dictValue = contentDict.get(dictKey);
      if (dictValue !== undefined) {
        contentMap[name] = dictValue;
      }
    }
    // console.log(`Content:${JSON.stringify(contentMap,null, 2)}`);
    return contentMap;
  } else {
    console.log(`Unknown content format indicator:${contentType}\n`);
  }
}

export async function unpackJettonOnchainMetadata(
  content: Cell,
  jetton: boolean = true,
  additional?: string[]
): Promise<{ [key: string]: string }> {
  const cs = content.beginParse();
  const contentType = cs.loadUint(8);
  if (contentType == 1) {
    const noData = cs.remainingBits == 0;
    if (noData && cs.remainingRefs == 0) {
      console.log('No data in content cell!\n');
      return {};
    } else {
      const contentUrl = noData ? cs.loadStringRefTail() : cs.loadStringTail();
      console.log(`Content metadata url:${contentUrl}\n`);
      return { uri: contentUrl };
    }
  } else if (contentType == 0) {
    let contentKeys: string[];
    const hasAdditional = additional !== undefined && additional.length > 0;
    const contentDict = Dictionary.load(
      Dictionary.Keys.BigUint(256),
      contentValue,
      cs
    );
    const contentMap: { [key: string]: string } = {};

    if (jetton) {
      contentKeys = hasAdditional
        ? [...defaultJettonKeys, ...additional]
        : defaultJettonKeys;
    } else {
      contentKeys = hasAdditional
        ? [...defaultNftKeys, ...additional]
        : defaultNftKeys;
    }
    for (const name of contentKeys) {
      const dictKey = BigInt('0x' + (await sha256(name)).toString('hex'));
      const dictValue = contentDict.get(dictKey);
      if (dictValue !== undefined) {
        contentMap[name] = dictValue;
      }
    }
    return contentMap;
  } else {
    console.log(`Unknown content format indicator:${contentType}\n`);
    return {};
  }
}

export async function packJettonOnchainMetadata(data: {
  [s: string]: string | undefined;
}): Promise<Cell> {
  // const KEYLEN: number = 256;
  const records = Dictionary.empty(Dictionary.Keys.BigUint(256), contentValue);

  for (const k in data) {
    const v = data[k];

    if (!jettonOnChainMetadataSpec[k as JettonMetaDataKeys])
      throw new Error(`Unsupported onchain key: ${k}`);

    if (v === undefined || v === '') continue;

    const bufferToStore = Buffer.from(
      v,
      jettonOnChainMetadataSpec[k as JettonMetaDataKeys]
    );
    const hash = await sha256(k);
    const hashStr = '0x' + hash.toString('hex');

    // console.log("Adding value: ", hashStr, " ==> ", bufferToStore.toString())
    records.set(BigInt(hashStr), bufferToStore.toString());
  }

  const result: Cell = beginCell()
    .storeInt(ONCHAIN_CONTENT_PREFIX, 8)
    .storeDict(records)
    .endCell();
  return result;
}
