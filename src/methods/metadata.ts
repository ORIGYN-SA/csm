import path from 'path';
import {
  LibraryFile,
  Meta,
  MetadataClass,
  MetadataProperty,
  NatValue,
  TextValue,
  ThawedArrayValue,
} from '../types/metadata.js';
import * as utils from '../utils/index.js';
import { log } from './logger.js';

export function getLibraries(nftOrColl: Meta) {
  const libraries = (nftOrColl.meta.metadata.Class.find((c) => c.name === 'library')?.value as ThawedArrayValue)?.Array
    .thawed as MetadataClass[];

  return libraries;
}

export function getClassByTextAttribute(classes: MetadataClass[], name: string, value: string) {
  const libraryMetadata = classes?.find((c) =>
    c?.Class?.find((c) => c?.name === name && (c?.value as TextValue)?.Text === value),
  );

  return libraryMetadata;
}

export function getAttribute(nftOrColl: MetadataClass, name: string): MetadataProperty {
  return nftOrColl?.Class?.find(a => a?.name === name) as MetadataProperty;
}

export function getLibraryMetadata(stageFolder: string, nftOrColl: Meta, libraryFile: LibraryFile, actualFileSize: bigint): MetadataClass {
  const libraryMetadata = getClassByTextAttribute(getLibraries(nftOrColl), 'library_id', libraryFile.library_id);
  if (!libraryMetadata) {
    const err = `Could not find metadata for libary ${libraryFile.library_id}`;
    throw err;
  }

  // ensure size is correct
  let librarySizeAttrib = getAttribute(libraryMetadata, 'size');
  if (librarySizeAttrib) {
    const libraryFileSize = (librarySizeAttrib?.value as NatValue)?.Nat || 0;
    if (BigInt(libraryFileSize) !== actualFileSize) {
      log(`Warning: The size of file ${libraryFile.library_file} (${libraryFileSize}) in the metadata does not match the actual file size: ${actualFileSize}.`);
      log('The file may have been modified manually or by a post-config script since the metadata was generated.');
      log('Replacing file size in metadata with the actual size.');

      librarySizeAttrib.value = { Nat: actualFileSize };
    }
  }

  // ensure content hash is correct
  let contentHashAttrib = getAttribute(libraryMetadata, 'content_hash');
  if (contentHashAttrib) {
    const contentHash = (contentHashAttrib?.value as TextValue)?.Text || '';
    const filePath = path.resolve(stageFolder, libraryFile.library_file);
    const actualContentHash = utils.getFileHash(filePath);
    if (contentHash !== actualContentHash) {
      log(`Warning: The hash of file ${libraryFile.library_file} (${contentHash}) in the metadata does not match the actual hash: ${actualContentHash}.`);
      log('The file may have been modified manually or by a post-config script since the metadata was generated.');
      log('Replacing content hash in metadata with the actual hash.');

      contentHashAttrib.value = { Text: actualContentHash };
    }
  }

  return libraryMetadata;
}
