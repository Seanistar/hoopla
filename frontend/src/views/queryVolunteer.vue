<template>
  <v-form ref="form">
    <v-container>
      <v-layout row wrap>
        <v-layout wrap>
          <v-flex xs12 sm4 d-flex>
            <v-select label="교구코드"
                      :items="la_codes" v-model="params.la_name"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="본당코드" ref="ma_name"
                      :items="ma_codes" v-model="params.ma_name" :disabled="params.la_name === null"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="지구코드" ref="sa_name"
                      :items="sa_codes" v-model="params.sa_name" :disabled="params.ma_name === null"
            ></v-select>
          </v-flex>
        </v-layout>

        <v-flex xs12 sm6>
          <date-picker ref="birth_date" refs="birth_date" title="생년월일"
          ></date-picker>
        </v-flex>
        <v-flex xs12 sm6>
          <date-picker ref="ca_date" refs="ca_date" title="세례일"
          ></date-picker>
        </v-flex>
        <v-flex xs12 sm6>
          <date-picker ref="auth_date" refs="auth_date" title="선서일"
          ></date-picker>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-radio-group v-model="params.sex" row>
            <span style="color: rgba(0,0,0,0.54)"><v-icon>wc</v-icon></span>&nbsp;&nbsp;:&nbsp;&nbsp;
            <v-radio label="남자" value="M"></v-radio>
            <v-radio label="여자" value="F"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12>
          그룹공부, 그룹봉사, 성서연수, 노트검사, 성서사십주간-읽기안내, 성서사십주간-심화
        </v-flex>
      </v-layout>

      <v-divider class="tm-10 bm-10"></v-divider>
      <v-layout class="fl-r">
        <div>
          <v-btn color="black accent-2" outline class="mb-2" @click="$router.back()">취소</v-btn>
        </div>
        <div>
          <v-btn color="orange accent-2" outline class="mb-2" @click="reset" >초기화</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="submit">조회</v-btn>
        </div>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import DatePicker from '@/components/control/DatePicker'

export default {
  name: 'QueryVoluneteer',
  components: { DatePicker },
  data: () => ({
    params: { // is equal to bible's column
      sex: 'f',
      state: 'ACT',
      ca_date: null,
      area_code: null,
      la_code: null, // 교구
      ma_code: null, // 본당
      sa_code: null, // 지구
      group_edu: null,
      group_vlt: null,
      note_done: null,
      bible_exe: null,
      bible_40_read: null,
      bible_40_deep: null
    },
    la_codes: [],
    ma_codes: [],
    sa_codes: []
  }),
  methods: {
    reset () {},
    submit () {}
  }
}
</script>

<style scoped>
</style>
