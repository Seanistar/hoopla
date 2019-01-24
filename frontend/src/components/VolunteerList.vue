<template>
  <v-container class="elevation-5 pt-2">
    <v-layout row align-baseline pb-0>
      <v-flex xs6>
        <v-layout row align-baseline>
          <!--<v-flex xs2>
            <v-subheader class="body-2 pr-0"><span>소속본당 : </span></v-subheader>
          </v-flex>-->
          <v-flex xs3>
            <v-combobox class="body-2" v-model="model"
                        @input="fetchVolunteers()" label="소속 본당"
                        :items="items" item-value="code" item-text="name"
                        :search-input.sync="search" clearable single-line>
              <template slot="no-data"><!--:disabled="authInfo.level === 'L3'"-->
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      "<strong>{{ search }}</strong>" 본당이 없습니다. 관리자에게 문의해주세요.
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-combobox>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <v-btn color="indigo accent-2" outline dark class="mb-3" @click="newVolunteer">신규 봉사자</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-data-table :headers="headers" :items="volunteers" class="elevation-5"
                  :pagination.sync="pagination" :rows-per-page-items="perPage" rows-per-page-text="페이지 당 보기 개수"
                  item-key="id" :loading="isVolunteersLoading && !fetched">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @dblclick="editItem(props.item)">
          <td class="text-xs-center"><span>{{(pagination.page - 1) * pagination.rowsPerPage + (props.index + 1)}}</span></td>
          <td class="text-xs-center">
            <span>{{ props.item.name }}</span>
            <v-badge color="orange" class="badge-pos"
                     overlap v-show="props.item.is_leader === 'Y'">
              <v-icon slot="badge" small>face</v-icon>
            </v-badge>
          </td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ activityState[props.item.state] }}</td>
          <!--<td class="text-xs-center">{{ props.item.la_name }}</td>
          <td class="text-xs-center">{{ props.item.ma_name }}</td>-->
          <td class="text-xs-center">{{ props.item.sa_name }}</td>
          <td class="text-xs-center">{{ props.item.au_date }}</td>
          <td class="text-xs-center">{{ props.item.br_date }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-3" @click.self="editItem(props.item)">edit</v-icon>
            <v-icon small @click.self="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{pageStart, pageStop, itemsLength}">
        전체 {{itemsLength}}개 중 {{ pageStart }} ~ {{ pageStop }}
      </template>
      <template slot="no-data" v-if="fetched">
        <v-alert :value="true" color="warning" icon="warning">
          표시할 봉사자 정보가 없습니다.
        </v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_VOLUNTEERS, DELETE_VOLUNTEER, FETCH_SMALL_LEADER } from '@/store/actions.type'
import { SET_CHANGED_CODE } from '@/store/mutations.type'
import { map, find, orderBy } from 'lodash/collection'

export default {
  name: 'VolunteerList',
  data: () => ({
    items: [],
    model: null,
    search: null,
    fetched: false,
    perPage: [10, 25, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
    pagination: { sortBy: 'id' },
    headers: [
      { text: '번호', value: 'id', sortable: false },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '활동상태', value: 'area_code' },
      { text: '소속본당', value: 'sa_name' },
      { text: '선서일', value: 'au_date' },
      { text: '생년월일', value: 'br_date' },
      { text: '편집', value: 'edit', sortable: false }
    ]
  }),
  computed: {
    ...mapGetters([
      'smallCodes',
      'areaCodes',
      'authInfo',
      'volunteers',
      'volunteersCount',
      'changedCodes',
      'isVolunteersLoading'
    ]),
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망' }
    }
  },
  watch: {
    model (val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
    },
    pagination (val) { console.log(val) }
  },
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
  },
  methods: {
    async fetchVolunteers (code) {
      let reqCode = code !== undefined ? code : (this.model ? this.model.code : '')
      console.log('request code...', reqCode, this.model)
      await this.$store.dispatch(FETCH_VOLUNTEERS, reqCode)
      this.fetched = true

      reqCode && this.$store.commit(SET_CHANGED_CODE, {type: 'vl_ac', code: reqCode})
    },
    newVolunteer () {
      // if (!this.model || !this.model.code) return alert('본당을 선택하세요!')
      // await this.$store.dispatch(FETCH_SMALL_LEADER, this.model.code)
      this.$router.push({name: 'edit-volunteer'})
    },
    editItem (item) {
      if (!item.area_code) return alert('본당을 선택하세요!')
      this.$store.dispatch(FETCH_SMALL_LEADER, item.area_code)
      this.$router.push({name: 'edit-volunteer', params: {id: item.id, item: item}})
    },
    deleteItem (item) {
      confirm('이 항목을 삭제하시겠습니까?') && this.$store.dispatch(DELETE_VOLUNTEER, item.id)
    },
    setLastChangedCode () {
      let code = this.changedCodes.vl_ac
      if (!code) code = this.authInfo.area_code

      this.setCodeInfo(code)
      this.fetchVolunteers(code)
    },
    async setCodeInfo (code) {
      if (!this.areaCodes.length) await this.$store.dispatch('fetchAreaCodes')
      const list = map(this.smallCodes(this.authInfo), o => { return {code: o.s_code, name: o.s_name} })
      this.items = orderBy(list, ['name'])

      const res = find(list, o => o.code === code)
      res && this.$nextTick(() => {
        this.model = {name: res.name, code: res.code}
        // console.log(this.model.name, this.model.code)
      })
    }
  }
}
</script>

<style scoped>
  .badge-pos {
    top: -15px;
    right: -15px
  }
</style>
