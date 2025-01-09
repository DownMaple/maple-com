self.onmessage = async function (event) {
  const {type, file, fileDate, uploadUrl, testHashUrl, mergeFileUrl} = event.data;
  if (type === 'generateFile') {
    // 文件上传逻辑
    await uploadFile(file, fileDate, uploadUrl, testHashUrl, mergeFileUrl)
  } else if (type === 'terminate') {
    self.postMessage({
      type: 'error',
      message: '上传终止'
    })
  } else {
    console.log('Unknown message type:', type);
  }
  // 释放线程
  self.close();
}

async function uploadFile(file, fileDate, uploadUrl, testHashUrl, mergeFileUrl) {
  // 先检验文件是否存在，和切片上传状态
  const testResult = await request(testHashUrl, {
    fileName: file.name,
    fileHash: file.fileHash,
    chunkHash: file.chunks.map(item => item.fileHash)
  })
  if (testResult.code === 200) {
    // 当文件存在，则直接返回文件地址
    if (testResult.message === '文件已存在') {
      self.postMessage({
        type: 'success',
        message: '文件已存在',
        data: testResult.data
      })
      return
    } else if (testResult.message === '文件名重复，已修改') {
      // 当文件同名，但是哈希值不同，则修改文件名，继续上传
      self.postMessage({
        type: 'updateFileName',
        message: '文件名重复，已修改',
        data: testResult.data
      })
      file.name = testResult.data.fileName
    }
  } else {
    // 上传失败
    self.postMessage({
      type: 'error',
      message: '上传失败，请检查网络连接或联系开发人员',
      error: testResult.error
    })
    return
  }
  
  // 根据文件检验结果，获取需要上传的切片
  const chunksToUpload = testResult.data.length > 0 ? file.chunks.filter(chunk => {
    return testResult.data.includes(chunk.fileHash)
  }) : file.chunks
  
  // 如果没有需要上传的切片，且文件不存在，则直接合并文件
  if (chunksToUpload.length === 0) {
    const mergeRes = await mergeFile(file, mergeFileUrl)
    if (mergeRes.code === 200) {
      self.postMessage({
        type: 'success',
        message: '文件完成上传',
        data: mergeRes.data
      })
    } else {
      self.postMessage({
        type: 'error',
        message: '文件合并失败'
      })
    }
    return
  }
  
  const uploadRequestList = requestMap(chunksToUpload, file.name, file.fileHash, uploadUrl)
  // 等待所有切片上传完成
  const allResult = await Promise.all(uploadRequestList);
  
  // 判断是否有切片上传失败，如果上传失败，则尝试重新上传一次
  if (allResult.some(item => item.code !== 200)) {
    // 这里不确定错误的会不会返回错误码，所以这里判断正确的
    const indexList = allResult.map((item, index) => {
      if (item.code === 200) {
        return index
      }
    })
    // 获取再次上传的切片列表
    const againUploadList = chunksToUpload.map(item => !indexList.indexOf(item.index))
    // 创建上传请求
    const againUploadRequestList = requestMap(againUploadList, file.name, file.fileHash, uploadUrl)
    const againAllResult = await Promise.all(againUploadRequestList);
    if (againAllResult.some(item => item.code !== 200)) {
      self.postMessage({
        type: 'error',
        message: '上传失败，请检查网络连接或联系开发人员'
      })
      return
    }
  }
  // 如果全部完成，则准备合并文件
  const mergeRes = await mergeFile(file, mergeFileUrl, fileDate)
  if (mergeRes.code === 200) {
    self.postMessage({
      type: 'success',
      message: '文件完成上传',
      data: mergeRes.data
    })
  } else {
    self.postMessage({
      type: 'error',
      message: '文件合并失败'
    })
  }
}

/**
 * 发送请求
 * @param url 请求地址
 * @param data 请求数据
 * @param method 请求方法
 * @param headers 请求头
 * @returns {Promise<unknown>}
 */
function request(url, data, method = 'POST', headers = {'Content-Type': 'application/json'}) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data)
    }).then(res => res.json())
        .then(response => {
          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
  })
}

/**
 * 请求映射
 * @param chunksList
 * @param fileName
 * @param fileHash
 * @param uploadUrl
 * @returns {*}
 */
function requestMap(chunksList, fileName, fileHash, uploadUrl) {
  return chunksList.map(chunk => {
    const formData = new FormData();
    formData.append('fileName', fileName);     // 文件名
    formData.append('chunkIndex', chunk.index);  // 当前切片的索引
    formData.append('chunkHash', chunk.fileHash);  // 当前切片的哈希值
    formData.append('fileHash', fileHash);     // 文件哈希值
    formData.append('file', chunk.chunk);    // 切片文件 (如果请求的node，记得放最后)
    return fetch(uploadUrl, {
      method: 'POST',
      body: formData // 使用 FormData 上传文件
    })
        .then(res => res.json())
        .then(response => {
          self.postMessage({
            type: 'uploadProgress',
            message: '切片上传成功',
            data: {
              chunkIndex: response.data.chunkIndex,
              chunkHash: response.data.fileHash
            }
          })
          return response
        }).catch(err => {
          return err
        });
  })
}

/**
 * 合并文件请求
 * @param file
 * @param mergeFileUrl
 * @param fileDate
 * @returns {Promise<unknown>}
 */
function mergeFile(file, mergeFileUrl, fileDate) {
  return new Promise((resolve, reject) => {
    fetch(mergeFileUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,      // 文件名称
        fileHash: file.fileHash,     // 文件哈希值
        totalChunks: file.chunkNum,   // 切片总数
        chunk: file.chunks.map(item => {  // 切片哈希数组
          return {fileHash: item.fileHash, index: item.index}
        }),
        ...fileDate
      })
    }).then(res => res.json())
        .then(response => {
          console.log(response)
          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
  })
}
