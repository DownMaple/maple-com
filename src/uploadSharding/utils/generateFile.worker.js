importScripts("spark-md5.js")
self.onmessage = async function (event) {
  
  const {file, chunkSize, uid} = event.data;
  const chunkNum = Math.ceil(file.size / chunkSize);
  
  const fileItem = {
    fid: uid,   // 没啥用的 id
    file,       // 文件对象
    name: file.name, // 文件名称
    size: file.size, // 文件大小
    loaded: 0,       // 已上传大小（好像没用到）
    progress: 0,     // 上传进度
    fileHash: await calculateHash(file),    // 整个文件的哈希值
    status: "create", // 初始化文件状态，这里用create表示已创建
    response: {},     // 上传请求的响应数据存放在这里
    chunkNum,         // 切片数量
    pathUrl: "",      // 上传后的地址
    chunks: [],       // 这里存放切片数组
    uploadedIndexList: [] // 这里是已上传的切片索引
  }
  let index = 0;
  let start = 0;
  // 根据 设置的 切片大小，循环生成切片数组
  while (start < file.size) {
    let end = start + chunkSize;
    if (end > file.size) end = file.size;
    
    const chunk = {
      index,    // 切片索引
      fileName: file.name,  // 文件名称
      fileHash: '',   // 切片的哈希值
      start,  // 切片开始位置
      end,    // 切片结束位置
      total: file.size,   // 文件总大小
      chunk: file.slice(start, end), // 调用 slice 方法进行文件切割
      chunkNum   // 切片数量
    };
    chunk.fileHash = await calculateHash(chunk.chunk);   // 计算切片的哈希值
    fileItem.chunks.push(chunk);
    start += chunkSize;
    index++;
  }
  self.postMessage(fileItem);    // 完成切片后，将文件对象发送给主线程
};

// 异步计算hash值
function calculateHash(chunk) {
  return new Promise((resolve, reject) => {
    // 初始化一个 FileReader 对象用于读取文件
    const reader = new FileReader();
    // 当文件读取成功后，计算哈希值
    reader.onloadend = function () {
      // 使用 SparkMD5 库计算 ArrayBuffer 的 MD5 哈希值
      const hash = SparkMD5.ArrayBuffer.hash(reader.result);
      resolve(hash); // 返回计算后的哈希值
    };
    // 如果文件读取过程中出现错误，拒绝 Promise 并返回错误信息
    reader.onerror = function (error) {
      reject(error); // 出错时拒绝
    };
    // 读取切片为 ArrayBuffer
    reader.readAsArrayBuffer(chunk);
  });
}
