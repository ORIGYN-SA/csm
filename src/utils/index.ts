import fs from 'fs';
import crypto from 'crypto';

export function wait(ms) {
  return new Promise((resolve) => {
    console.log(`\nWaiting ${ms / 1000} seconds...`);
    setTimeout(() => {
      console.log('Wait time complete.\n');
      resolve(ms);
    }, ms);
  });
}

export function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

export function escapeRegex(s) {
  // credit: https://mail.mozilla.org/pipermail/es-discuss/2012-March/021635.html
  return s.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&');
}

export function formatBytes(bytes, decimals = 2) {
  // credit: https://stackoverflow.com/a/18650828
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function insertText(originalText, textToInsert, insertAt) {
  if (insertAt > -1) {
    return originalText.substring(0, insertAt) + textToInsert + originalText.substring(insertAt);
  }
  return originalText;
}
