<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4" v-model="tabIdx">
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout mt-4 pt-0 class="elevation-3">
      <component :is="targetComponents[tabIdx]" :v_id="id">
        <template slot="voltInfo">
          <inline-text-box :au_year="voltInfo.au_date|yearstamp"
                           :v_name="`${voltInfo.name} ${voltInfo.ca_name} (${voltInfo.sa_name} 본당)`"
                            v-if="voltInfo && Object.keys(voltInfo).length"/>
        </template>
        <div slot="moveTo">
          <v-layout mt-3>
            <router-link :to="{name: 'edit-volunteer', params: {id: id, menu: tabIdx === 4 ? 'm-2' : 'm-1'}}"
                         class="txt-deco-none" replace>
              <v-flex xs6 text-xs-left><v-btn outline color="primary">관리 화면 이동</v-btn></v-flex>
            </router-link>
            <v-flex xs11 text-xs-right><v-btn outline @click="$router.back()" color="primary">이전 화면 이동</v-btn></v-flex>
          </v-layout>
        </div>
      </component>
    </v-layout>
    <float-button path="queries"/>
  </v-container>
</template>

<script>
import QueryEdus from '@/components/QueryEdus'
import QueryBibles from '@/components/QueryBibles'
import QueryActs from '@/components/QueryActs'
import QueryNotes from '@/components/QueryNotes'
import QueryGroup from '@/components/QueryGroup'
import FloatButton from '@/components/control/FloatButton'
import InlineTextBox from '@/components/control/InlineTextBox'

export default {
  name: 'ViewQuery',
  components: { QueryEdus, QueryNotes, QueryBibles, QueryGroup, QueryActs, FloatButton, InlineTextBox },
  props: { id: null },
  computed: {
    targetComponents () {
      return ['QueryEdus', 'QueryBibles', 'QueryNotes', 'QueryGroup', 'QueryActs']
    }
  },
  watch: {
    tabIdx: {
      immediate: true,
      handler (idx) {
        let path = ''
        if (location.pathname.indexOf('/m-') > 0) {
          path = location.pathname.slice(0, -1) + idx
        } else {
          path = `${location.pathname}/m-${idx}`
        }
        window.history.replaceState({}, null, path)
      }
    }
  },
  data: () => ({
    tabIdx: 0,
    voltInfo: null,
    titles: ['기본 교육 현황', '성서 연수 현황', '노트 검사 현황', '그룹 공부 현황', '봉사 현황']
  }),
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      /* eslint-disable */
      const {id, menu} = to.params
      if (menu) {
        const [m, idx] = menu.split('-')
        idx && (vm.tabIdx = parseInt(idx))
      }
      if (id) {
        await vm.$store.dispatch('fetchVolunteerItem', id)
        vm.voltInfo = vm.$store.getters.volunteerInfo(parseInt(id))
        console.log(vm.voltInfo)
      }
    })
  }
}
</script>

<style scoped>
</style>
