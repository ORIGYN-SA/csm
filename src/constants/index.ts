export const LINE_DIVIDER_SUBCOMMAND = '**************************************';
export const LINE_DIVIDER_SECTION = '--------------------------------------';

export const STAGE_FOLDER = '__staged';
export const COLLECTION_FOLDER = 'collection';
export const DAAPS_FOLDER = 'dapps';
export const NFTS_FOLDER = 'nfts';
export const CONFIG_FILE_NAME = 'metadata.json';
export const COM_ORIGYN_NS = 'com.origyn';
export const GOV_CANISTER_ID = 'a3lu7-uiaaa-aaaaj-aadnq-cai';

// the captured url will be at index 2 of the match
export const HTML_URL_ATTRIBS_REGEX =
  /<(?:a|link|script|img|video|object)[^>]*?(?:href|src|srcset|data-src|data-href|data)\s*=\s*(['"]?)(.*?)\1[^>]*>/gi;

// <use href='http://example.com/another.svg' />
// the captured url will be at index 2 of the match
export const SVG_URL_ATTRIBS_REGEX = /<use[^>]+(?:xlink:)?href\s*=\s*(['"]?)(.*?)\1[^>]*>/gi;

// many CSS attributes take a url: background, background-image, border-image, content, cursor, list-style-image, mask-image, shape-outside, src
// the format is always the same: <attribute name>: url("http://example.com")
// the captured url will be at index 2 of the match
export const CSS_URL_ATTRIBS_REGEX = /:\s*url\(\s*(['"]?)(.*?)\1[^\)]*\)/gi;

export const SRCSET_VALUE_UNIT_REGEX = /(\s\d+w)|(\s\d+(?:\.\d+)?x)/gi;
export const HTTP_OR_HTTPS_REGEX = /https?:\/\//gi;
export const DATA_URL_REGEX = /data:/gi;

// 1024 * 1024 * 2 - 1024 * 48 = 2 MB - 48 KB (2,048,000 B)
export const MAX_CHUNK_SIZE = 2_048_000;
export const DEFAULT_MINT_BATCH_SIZE = 10;
export const MAX_CHUNK_UPLOAD_RETRIES = 5;
