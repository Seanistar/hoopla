<template>
  <v-container pt-3 pb-3 mt-2 elevation-3>
    <v-layout pb-2 pl-2 align-center>
      <v-flex :class="$parent.winWidth < 900 ? 'xs4' : 'xs2'">
        <div>전체 이력 : {{volunteerHistory.length}} 건</div>
      </v-flex>
      <v-flex :class="$parent.winWidth < 900 ? 'xs8' : 'xs4'">
        <slot name="voltInfo"></slot>
      </v-flex>
      <v-flex xs6 v-if="$parent.winWidth >= 900">
        <div class="text-xs-right caption grey--text">※ 봉사자 기본 정보에서 본당 정보 변경 시 자동 갱신됩니다.</div>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerHistory" hide-actions
                  class="elevation-1 mb-2" :loading="fetched && isVolunteersLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr> <!--@click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">-->
          <td class="text-xs-center">{{ props.item.idx }}</td>
          <td class="text-xs-center">{{ props.item.out_name }}</td>
          <td class="text-xs-center">{{ props.item.in_name }}</td>
          <td class="text-xs-center">{{ props.item.do_date }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
        <tr class="text-xs-center"><td colspan="6">전출입 이력이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_HISTORY } from '../../store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'VolunteerHistory',
  props: { v_id: undefined },
  computed: {
    ...mapGetters([
      'actCodes',
      'volunteerHistory',
      'isVolunteersLoading'
    ]),
    isLoading () {
      return isUndefined(this.v_id) ? false : this.isVolunteersLoading
    }
  },
  data: () => ({
    fetched: false,
    headers: [
      { text: '번호', value: 'id' },
      { text: '전출 구역', value: 'out_name', sortable: false },
      { text: '전입 구역', value: 'in_name', sortable: false },
      { text: '작성 날짜', value: 'do_date', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    this.fetchData()
  },
  methods: {
    async fetchData () {
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_HISTORY, this.v_id)
      this.fetched = true
    }
  }
}
</script>

<style scoped>
</style>
