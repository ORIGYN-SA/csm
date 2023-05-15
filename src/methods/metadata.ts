import path from 'path';
import type { PropertyShared } from '../idl/origyn_nft_reference.did.d.js';
import type {
  LibraryFile,
  MetaWithLibrary,
  MetadataClass,
  NatValue,
  TextValue,
  ArrayValue,
} from '../types/metadata.js';
import * as utils from '../utils/index.js';
import { log } from './logger.js';

export function getLibraries(nftOrColl: MetaWithLibrary): MetadataClass[] {
  const libraries = (nftOrColl.meta.metadata.Class.find((p) => p.name === 'library')?.value as ArrayValue)
    ?.Array as MetadataClass[];

  return libraries;
}

export function getClassByTextAttribute(
  classes: MetadataClass[],
  name: string,
  value: string,
): MetadataClass | undefined {
  const libraryMetadata = classes?.find((c) =>
    c?.Class?.find((p) => p?.name === name && (p?.value as TextValue)?.Text === value),
  );

  return libraryMetadata;
}

export function getAttribute(nftOrColl: MetadataClass, name: string): PropertyShared {
  return nftOrColl?.Class?.find((p) => p?.name === name) as PropertyShared;
}

export function getLibraryMetadata(
  stageFolder: string,
  nftOrColl: MetaWithLibrary,
  libraryFile: LibraryFile,
  actualFileSize: bigint,
): MetadataClass {
  const libraryMetadata = getClassByTextAttribute(getLibraries(nftOrColl), 'library_id', libraryFile.library_id);
  if (!libraryMetadata) {
    const err = `Could not find metadata for libary ${libraryFile.library_id}`;
    throw new Error(err);
  }

  // ensure size is correct
  const librarySizeAttrib = getAttribute(libraryMetadata, 'size');
  if (librarySizeAttrib) {
    const libraryFileSize = (librarySizeAttrib?.value as NatValue)?.Nat || 0;
    if (BigInt(libraryFileSize) !== actualFileSize) {
      log(
        `Warning: The size of file ${libraryFile.library_file} (${libraryFileSize}) in the metadata does not match the actual file size: ${actualFileSize}.`,
      );
      log('The file may have been modified manually or by a post-config script since the metadata was generated.');
      log('Replacing file size in metadata with the actual size.');

      librarySizeAttrib.value = { Nat: actualFileSize };
    }
  }

  // ensure content hash is correct
  const contentHashAttrib = getAttribute(libraryMetadata, 'content_hash');
  if (contentHashAttrib) {
    const contentHash = (contentHashAttrib?.value as TextValue)?.Text || '';
    const filePath = path.resolve(stageFolder, libraryFile.library_file);
    const actualContentHash = utils.getFileHash(filePath);
    if (contentHash !== actualContentHash) {
      log(
        `Warning: The hash of file ${libraryFile.library_file} (${contentHash}) in the metadata does not match the actual hash: ${actualContentHash}.`,
      );
      log('The file may have been modified manually or by a post-config script since the metadata was generated.');
      log('Replacing content hash in metadata with the actual hash.');

      contentHashAttrib.value = { Text: actualContentHash };
    }
  }

  return libraryMetadata;
}
