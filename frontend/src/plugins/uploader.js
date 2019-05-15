import { UtilityService } from '@/common/api.service'

class UploadAdapter {
  constructor (loader, origin) {
    this.loader = loader
    this.origin = origin
  }

  upload () {
    return new Promise(async (resolve, reject) => {
      const form = new FormData()
      const file = await this.loader.file
      form.append('fileID', this.origin)
      form.append('helper', file, 'helper image')
      UtilityService.uploadHelperImage(form)
        .then(res => {
          let url = process.env.NODE_ENV === 'production' ? 'http://172.26.2.212/helper/' : 'http://localhost:3000/helper/'
          url += res.data

          // console.log(url)
          resolve({default: url})
        })
        .catch(err => {
          this.uploadError = err.response.data.message
          reject(err.response.data.message)
        })
    })
  }
}

export const UploadAdapterPlugin = (editor) => {
  const origin = editor.config.get('serial')
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new UploadAdapter(loader, origin)
  }
}
