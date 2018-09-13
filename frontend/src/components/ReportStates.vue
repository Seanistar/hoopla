<template>
  <v-container>
    <v-layout row wrap align-end>
      <v-flex xs6>
        <v-layout row wrap >
          <v-flex xs7>
            <v-subheader class="subheading"><span class="mr-3">작성자 :</span>
              <v-text-field value="김대건 안드레아" clearable single-line></v-text-field>
              <!--<span>김대건 안드레아</span>-->
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <!--<v-btn color="black accent-2" outline dark class="mb-2" @click="$router.back()">리스트로 가기</v-btn>-->
          <v-btn color="indigo accent-2" outline dark  @click="updateState">현황 저장</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row mt-2>
      <table style="width:100%; border: 2px grey solid;">
        <tr>
          <th style="width: 20%"></th>
          <th colspan="4" style="width: 40%" class="subheading font-weight-bold">그룹 공부 현황</th>
          <th colspan="4" style="width: 40%" class="subheading font-weight-bold">연수 현황</th>
        </tr>
        <tr>
          <th rowspan="2">주제</th>
          <th colspan="2" v-for="n in 4" :key="n">{{ n % 2 === 0 ? '직장인반': '낮반' }}</th>
        </tr>
        <tr>
          <th v-for="i in 8" :key="i">{{ i % 2 === 0 ? '인원' : '그룹'}}</th>
        </tr>
        <tr v-for="(item, index) in trnCodes" :key="index">
            <td :id="item.code">{{item.name|subject}}</td>
            <td v-for="j in 8" :key="j">
              <input type="number" style="width: 100%; text-align: center">
            </td>
        </tr>
        <tr style="border-top: 2px grey solid;">
          <td>합계</td>
          <td v-for="i in 8" :key="i">
            <input type="number" readonly style="width: 100%; text-align: center">
          </td>
        </tr>
      </table>
    </v-layout>

    <v-layout row mt-4>
      <table style="width:100%; border: 2px grey solid;">
        <tr>
          <th colspan="2" style="width: 20%">성서 40주간</th>
          <th colspan="2" style="width: 20%">월모임</th>
          <th colspan="2" style="width: 20%" class="subheading font-weight-bold">교육 현황(특강,재교육)</th>
          <th colspan="6" style="width: 40%" class="subheading font-weight-bold">봉사자 현황</th>
        </tr>
        <tr>
          <th style="width: 10%">낮 반</th>
          <th style="width: 10%">저녁 반</th>
          <th>본당</th>
          <th>본부</th>
          <th>본당</th>
          <th>본부</th>
          <th colspan="2" style="width: 13.3%">활동</th>
          <th colspan="2" style="width: 13.3%">쉼</th>
          <th colspan="2" style="width: 13.3%">예비</th>
        </tr>
        <tr>
          <td v-for="i in 2" :key="i"><input type="number" style="width: 80%; text-align: right">명</td>
          <td v-for="j in 4" :key="j+2"><input type="number" style="width: 80%; text-align: right">회</td>
          <td v-for="k in 6" :key="k+6" style="text-align: center">{{ k % 2 === 1 ? '여' : '남' }}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td v-for="j in 4" :key="j"><input type="number" style="width: 80%; text-align: right">명</td>
          <td v-for="k in 6" :key="k+4"><input type="number" style="width: 100%; text-align: right"></td>
        </tr>
      </table>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuButtons from './control/MenuButtons'

export default {
  name: 'ReportStates',
  components: { MenuButtons },
  computed: {
    ...mapGetters([
      'trnCodes'
    ])
  },
  data: () => ({
    items: [],
    model: '',
    search: null,
    selected: {},
    topics: [
      { text: '창세기', code: '' },
      { text: '탈출기', code: '' }
    ],
    headers: [
      { text: '작성 연도', value: 'year' },
      { text: '작성자', value: 'name' },
      { text: '연락처', value: 'phone' },
      { text: '작성일', value: 'date' },
      { text: '현황보고서', value: 'state' },
      { text: '명단리스트', value: 'volts' },
      { text: '봉사보고서', value: 'acts' }
    ]
  }),
  methods: {
    updateState () {

    },
    cancel () {

    }
  },
  filters: {
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
    }
  }
}
</script>

<style scoped>
  table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
    color: dimgrey;
  }
  th, td {
    padding: 5px;
    text-align: center;
  }

</style>
