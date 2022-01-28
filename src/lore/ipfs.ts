import axios from "axios";
import { marked } from "marked";
import Token = marked.Token;
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

const IPFS_SERVER =
  process.env.IPFS_SERVER ?? "https://nfts.forgottenrunes.com/ipfs";

export async function fetchAndDehydrateLore(loreMetadataURI: string): Promise<{
  rawContent?: any;
  markdownText?: string;
  previewText?: string;
  images: string[];
}> {
  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  console.log(loreMetadataURI);
  console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL.endsWith("undefined")) {
    return { images: [] };
  }

  console.log(`Fetching lore metadata for ${ipfsURL}`);
  let res;
  try {
    res = await axios.get(ipfsURL);
  } catch (e: any) {
    console.error(
      "Fetch from network error (after retries)... will skip this entry...."
    );
    return { images: [] };
  }

  if (res.status >= 200 && res.status < 300) {
    const json: any = res.data;
    // console.log(json);

    const textsForPreivew: string[] = [];
    const images: string[] = [];

    // Override function
    const walkTokens = (token: Token) => {
      if (token.type === "paragraph" && token?.text.length > 0) {
        for (let i = 0; i < token.tokens.length; i++) {
          const childToken = token.tokens[i];

          if (childToken.type === "image") {
            // console.log(childToken);
            images.push(childToken.href);
            continue;
          }

          textsForPreivew.push(
            // @ts-ignore
            childToken.type === "text" ? childToken.raw : childToken.text
          );
        }
      } else if (token.type === "image" && token?.text.length > 0) {
        images.push(token.href);
      }
    };

    const markdownText = json?.description;

    marked.use({ walkTokens });
    marked.parse(markdownText ?? "");

    return {
      rawContent: json,
      markdownText,
      previewText: truncate(textsForPreivew.join("")),
      images,
    };
  } else {
    console.error("Bad IPFS request: " + res.statusText);
    throw Error("IPFS issue");
  }
}

export const truncate = (input: string, length: number = 280) =>
  input.length > length ? `${input.substring(0, length)}...` : input;
