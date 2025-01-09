export interface FileItemType {
  hash: string;
  file: File;
  name: string;
  size: number;
  loaded: number
  progress: number
  status: string;
  response: any
  chunkNum: number
  pathUrl: string
  chunks: ChunkType[]
  uploadedIndexList: number[]
}

export interface ChunkType {
  index: number;
  fileName: string;
  fileHash: string;
  start: number;
  end: number;
  total: number;
  chunk: Blob;
  chunkNum: number
}
