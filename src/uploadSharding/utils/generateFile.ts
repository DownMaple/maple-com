import type {FileItemType} from './type.ts';
import {UploadRawFile} from 'element-plus/es/components/upload/src/upload';

export function generateFile(file: UploadRawFile, chunkSize = 1024 * 1024 * 5) {
  return new Promise<FileItemType>((resolve) => {
    // 创建一个 web worker, 通过 new URL() 引入 worker 文件
    const worker = new Worker(new URL('./generateFile.worker.js', import.meta.url));
    // 监听 worker 线程的消息
    worker.onmessage = function (event) {
      resolve(event.data);
      worker.terminate();
    };
    // 将文件、切片大小、uid 发送给 worker现成，worker 接收到消息开始执行
    worker.postMessage({file, chunkSize, uid:file.uid});
  });
}

