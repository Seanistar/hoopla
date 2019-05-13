<template>
  <v-container fluid align-center class="px-2 py-2 container-side container-detail content-discussion-write">
    <v-layout row wrap>
      <v-card class="w-100 box-write mb-2">
        <!--<div class="title text-xs-center box-title" v-if="editable">
          <span>도움말 편집</span>
        </div>
        <v-divider light class="my-3"></v-divider>-->

        <div id="writer" class="mt-3">
          <ckeditor :editor="editor" v-model="content" :config="config" :disabled="!editable"
          ></ckeditor>
        </div>

        <v-card-actions class="px-0 mt-2 box-btn" v-if="editable">
          <v-flex xs12 text-xs-right>
            <!--<v-btn @click.stop="onCancel" color="#dfdfdf" class="btn-cancel">
              <div>취소</div>
            </v-btn>-->
            <v-btn @click.stop="onSubmit" :disabled="isEqualInfo()" color="primary" class="bc-primary btn-ok">
              <div>저장</div>
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_HELPER, UPDATE_HELPER } from '@/store/actions.type'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { UploadAdapterPlugin } from '@/plugins/uploader'

export default {
  name: 'AppHelper',
  props: ['editable'],
  components: { ckeditor: CKEditor.component },
  computed: {
    ...mapGetters(['helper'])
  },
  watch: {
    editable (val) {
      setTimeout(() => {
        // const save = val ? 200 : 150
        const box = document.querySelector('.ck-editor__editable')
        if (box) box.style.height = '100%'

        const bar = document.querySelector('.ck-toolbar')
        if (val) bar.classList.remove('no-display')
        else bar.classList.add('no-display')
        // if (val && !this.content) this.content = '<p>도움말을 입력하세요.</p>'
      }, 10)
    }
  },
  data () {
    return {
      title: '',
      editorDisabled: true,
      editor: ClassicEditor,
      content: '',
      config: {
        originType: 'discussion',
        extraPlugins: [ UploadAdapterPlugin ],
        image: {
          toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
          styles: [ 'full', 'alignLeft', 'alignRight' ]
        }
      }
    }
  },
  methods: {
    async fetchInfo () {
      await this.$store.dispatch(FETCH_HELPER)
      this.content = this.helper['content']
      this.$forceUpdate()
    },
    onSubmit () {
      this.$store.dispatch(UPDATE_HELPER, {content: this.content}).then(() => this.fetchInfo())
    },
    onCancel () {
      this.content = this.helper['content']
    },
    isEqualInfo () {
      return this.content === this.helper['content']
    }
  },
  created () {
    this.fetchInfo()
  },
  mounted () {
    setTimeout(() => {
      const box = document.querySelector('.ck-editor__editable')
      if (box) box.style.height = '100%' //  (window.innerHeight - 150) + 'px'
      const bar = document.querySelector('.ck-toolbar')
      bar.classList.add('no-display')
    }, 100)
  }
}
</script>

<style scoped lang="scss">
  .title {
    font-size: 18px;
    color: #697589;
  }
  .v-card {
    box-shadow: unset !important;
    -webkit-box-shadow: unset !important;
  }
  .bg-grey {
    width: 100%;
    height: 100%;
  }
  .box-write {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0 !important;
  }
  .content-discussion-write {
    margin-top: 8px !important;
    padding-top: 5px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    overflow-x: hidden;
    hr.v-divider {
      margin-left: -20px;
      margin-right: -20px;
      max-width: inherit;
      margin-top: 16px !important;
      margin-bottom: 22px !important;
    }
  }
  .box-title {
    padding: 12px 0 0 !important;
    span {
      font-size: 20px !important;
      font-weight: 500;
    }
  }
  .txt-caption {
    font-size: 13px;
    color: #515151;
    margin-bottom: 6px;
  }
</style>
<style>
  .no-display {
    display: none !important;
  }
</style>