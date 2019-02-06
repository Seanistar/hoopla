<template>
  <div class="image-box text-xs-center mt-1">
    <form enctype="multipart/form-data" novalidate>
      <input type="file" accept="image/*" label="사진 업로드" class="input-file"
             name="photoUploader" @change="changeImage($event.target.files)">
    </form>
    <slot></slot>
  </div>
</template>

<script>
import { UtilityService } from '@/common/api.service'

export default {
  name: 'ImageUploader',
  props: ['cid', 'callback'],
  data () {
    return {
      v_image: null
    }
  },
  methods: {
    changeImage (file) {
      if (!file.length) return
      if (!this.cid) return this.$showSnackBar('봉사자 번호가 필요합니다.')

      const formData = new FormData()
      formData.append('cid', this.cid)
      formData.append('photoUploader', file[0])

      const self = this
      return UtilityService.uploadImage(formData)
        .then(res => {
          const url = '/photos/' + res.data
          console.log(url)
          self.callback(url)
        })
        .catch(err => {
          this.uploadError = err.response.data.message
          console.warn(this.uploadError)
        })
    },
    getImageData (file) {
      return new Promise((resolve, reject) => {
        const fReader = new FileReader()
        const img = document.createElement('img')
        fReader.onload = () => {
          img.src = fReader.result
          resolve(this.getBase64Image(img))
        }
        fReader.onerror = (err) => {
          reject(err)
        }
        fReader.readAsDataURL(file)
      })
    },
    getBase64Image (img) {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const dataURL = img.src
      return dataURL
    }
  }
}
</script>

<style scoped>
  .image-box {
    border: 1px solid grey; /* the dash box */
    /*outline-offset: -10px;*/
    background: lightcyan;
    color: dimgray;
    /*padding: 0 10px;*/
    min-height: 152px; /* minimum height */
    height: 182px;
    width: 152px;
    position: relative;
    cursor: pointer;
    /*padding-top: 50% !important;*/
  }
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 182px;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
  }
  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }
  .no-image {
    position: absolute;
    left: 48px;
    padding-top: 50% !important;
  }
  .image-box span {
    /*font-size: 1.2em;*/
    text-align: center;
  }
  .image-box img {
    width: 100%;
    max-width: 150px;
    max-height: 180px;
    /*padding-top: 0 !important;*/
    /*height: 150px;*/
  }
</style>
