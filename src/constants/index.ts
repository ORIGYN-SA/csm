export const LINE_DIVIDER_SUBCOMMAND = '**************************************';
export const LINE_DIVIDER_SECTION = '--------------------------------------';

export const STAGE_FOLDER = '__staged';
export const COLLECTION_FOLDER = 'collection';
export const DAAPS_FOLDER = 'dapps';
export const NFTS_FOLDER = 'nfts';
export const CONFIG_FILE_NAME = 'metadata.json';

// HTML and CSS attributes can use double or single quotes
// however, neither are allowed in URLs, so there
// is no need to use a backreference to the first quote.
export const HTML_URL_ATTRIBS_REGEX =
  /<(?:a|link|script|img|video)[^>]*(?:href|src|srcset)\s*=\s*[\"']([^\"']+)[\"'][^>]*>/gi;
export const CSS_URL_ATTRIBS_REGEX = /[:\s]url\s*\(\s*[\"']([^\"']*)[\"']\s*\)/gi;
export const SRCSET_VALUE_UNIT_REGEX = /(\s\d+w)|(\s\d+(?:\.\d+)?x)/gi;
export const HTTP_OR_HTTPS_REGEX = /https?:\/\//gi;
export const DATA_URL_REGEX = /data:/gi;

// 1024 * 1024 * 2 - 1024 * 48 = 2 MB - 48 KB (2,048,000 B)
export const MAX_CHUNK_SIZE = 2_048_000;
export const DEFAULT_MINT_BATCH_SIZE = 10;
export const MAX_CHUNK_UPLOAD_RETRIES = 5;
