import fs from 'fs';
import fse from 'fs-extra';
import crypto from 'crypto';
import path from 'path';
import { log } from '../methods/logger.js';
import * as constants from '../constants/index.js';

const ignoredFolders = ['node_modules', '.vscode', '.idea', '.vessel'];
const ignoredFiles = ['.ds_store', '.gitignore'];

export async function wait(ms: number): Promise<number> {
  return await new Promise((resolve) => {
    log(`\nWaiting ${ms / 1000} seconds...`);
    setTimeout(() => {
      log('Wait time complete.\n');
      resolve(ms);
    }, ms);
  });
}

export function getFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

export function getBase64(filePath: string): string {
  try {
    const fileData = fs.readFileSync(path.resolve(filePath));
    return fileData.toString('base64');
  } catch (err) {
    console.error(err);
    return '';
  }
}

export function escapeRegex(s: string): string {
  // credit: https://mail.mozilla.org/pipermail/es-discuss/2012-March/021635.html
  return s.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&');
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  // credit: https://stackoverflow.com/a/18650828
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toString() + ' ' + sizes[i];
}

export function insertText(originalText: string, textToInsert: string, insertAt: number): string {
  if (insertAt > -1) {
    return originalText.substring(0, insertAt) + textToInsert + originalText.substring(insertAt);
  }
  return originalText;
}

export function findUrls(filePath: string, contents: string): RegExpMatchArray[] {
  const ext = path.extname(filePath).toLowerCase();

  let matches: RegExpMatchArray[] = [];
  if (['.html', '.htm'].includes(ext)) {
    matches = [...contents.matchAll(constants.HTML_URL_ATTRIBS_REGEX)];
  } else if (ext === '.css') {
    matches = [...contents.matchAll(constants.CSS_URL_ATTRIBS_REGEX)];
  } else if (ext === '.svg') {
    matches = [...contents.matchAll(constants.SVG_URL_ATTRIBS_REGEX)];
  }

  return matches;
}

export function getExternalUrls(filePath: string): string[] {
  const contents: string = fs.readFileSync(filePath).toString();
  const matches = findUrls(filePath, contents);

  log(`\nregex matches ${matches.length}`);
  log(JSON.stringify(matches, null, 2));

  if (matches.length === 0) {
    return [];
  }

  const urls = matches.flatMap((m) =>
    // regex group matching the value of an href, src or srcset attribute,
    // or a CSS url function
    // could be a single url, or multiple urls if the attribute is srcset
    m[1]
      // split comma delimited list of images if srcset attribute
      .split(',')
      // trim any spaces left after the above split
      .map((v) => v.trim())
      // only return urls that start with http or https (external)
      .filter((v) => v.search(/https?:\/\//gi) === 0),
  );

  return urls;
}

export function copyFolder(fromPath: string, toPath: string): void {
  fse.ensureDirSync(toPath);
  fse.emptyDirSync(toPath);
  fse.copySync(fromPath, toPath, { overwrite: true });
}

export function getSubFolders(parentFolder: string): string[] {
  const subFolders = fs
    .readdirSync(path.resolve(parentFolder))
    .filter(
      (subFolder) =>
        !ignoredFolders.includes(subFolder.toLowerCase()) &&
        fs.lstatSync(path.resolve(parentFolder, subFolder)).isDirectory(),
    )
    .map((subFolder) => path.resolve(parentFolder, subFolder));

  return subFolders;
}

export function flattenFiles(
  currentFolder: string,
  rootFolder: string,
  flatFiles: string[] = [],
  uniqueFileNames = new Set(),
): string[] {
  const currentFolderFullPath = path.resolve(rootFolder, currentFolder);
  const objects = fs.readdirSync(currentFolderFullPath);

  const subFolders = objects.filter(
    (folderName) =>
      !ignoredFolders.includes(folderName.toLowerCase()) &&
      fs.lstatSync(path.resolve(currentFolderFullPath, folderName)).isDirectory(),
  );

  const files = objects.filter(
    (fileName) =>
      !ignoredFiles.includes(fileName.toLowerCase()) &&
      fs.lstatSync(path.resolve(currentFolderFullPath, fileName)).isFile(),
  );

  files.forEach((file) => {
    const fileNameLower = path.basename(file).toLowerCase();

    if (uniqueFileNames.has(fileNameLower)) {
      const err = `Duplicate file name: ${file}`;
      throw new Error(err);
    }
    uniqueFileNames.add(fileNameLower);

    const fullFilePath = path.resolve(currentFolderFullPath, file);
    flatFiles.push(fullFilePath);
  });

  subFolders.forEach((subFolder) => {
    flattenFiles(path.resolve(currentFolderFullPath, subFolder), rootFolder, flatFiles, uniqueFileNames);
  });

  return flatFiles;
}
