<template>
  <div>
    <v-container pt-0>
      <v-text-field label="Catholic Bible Life Movement" readonly disabled></v-text-field>
      <v-layout>
        <v-flex xs4>
          <v-img src="../static/bible.jpeg" height="450" aspect-ratio="3.0"></v-img>
        </v-flex>
        <v-flex xs8>
          <v-responsive>
            <v-container fill-height v-if="!isAuth">
              <v-layout align-center>
                <v-flex xs12 class="pl-2">
                  <h4 class="display-1 pb-4">환영합니다.</h4>
                  <span class="subheading">주님의 은총으로 말씀 봉사의 부르심에 응답하는 봉사자들을 효과적으로 관리하고 지원하기 위한 프로그램입니다.</span><br/>
                  <span class="subheading">봉사자들의 그룹공부, 연수현황, 월교육, 재교육, 특강, 피정, 전출입, 노트검사 및 보완 교육 등을 체계적으로 정리하여 성서모임 수녀님들이 함께 공유하는 데 목적이 있습니다.</span>
                  <v-divider class="my-4"></v-divider>
                  <v-data-table hide-actions light
                                :headers="headers" :items="bodies" class="elevation-1 admin-table"
                                item-key="id">
                    <template slot="headers" slot-scope="props">
                      <tr>
                        <th v-for="header in props.headers" :key="header.text"
                            class="body-2 font-weight-regular align-center"
                        >{{ header.text }}
                        </th>
                      </tr>
                    </template>
                    <template slot="items" slot-scope="props">
                      <tr>
                        <td v-for="(body, idx) in bodies[0]" :key="idx"
                            class="body-2 font-weight-regular align-center text-xs-center"
                            @click="onLogin(body)"
                        >{{ body }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                  <v-divider class="my-4"></v-divider>
                  <div class="title my-3">관리자 계정으로 로그인하세요!</div>
                  <v-btn class="mx-0" color="brown darken-2" large outline @click="dialog = true">LOGIN</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container v-else>
              <v-layout align-center>
                <v-flex xs12 class="pl-2">
                  <h4 class="display-1 pb-4">인증 완료</h4>
                  <span class="subheading">{{authInfo.level === 'L4' ? '최고' : '일반'}} 관리자로 로그인되었습니다.</span>
                  <v-divider class="my-4"></v-divider>
                  <div class="title my-3">ID : {{authInfo.id}} ({{authInfo.name}})</div>
                  <v-btn class="mx-0 mt-4" color="brown darken-2" large outline @click="logout">LOGOUT</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-responsive>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card @keydown.enter="login">
        <v-card-title class="headline grey lighten-2" primary-title>관리자 로그인</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 아이디</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="ID" clearable required v-model="admin.id"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 암호</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="Password" v-model="admin.pwd" required autofocus
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="!showPassword ? 'visibility_off' : 'visibility'"
                            @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" outline @click="dialog = false">취소</v-btn>
          <v-btn color="primary" outline @click="login">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { LOGIN_ADMIN } from '@/store/actions.type'
import { REMOVE_AUTH, SET_CHANGED_CODE } from '@/store/mutations.type'
import { mapGetters } from 'vuex'
import { map } from 'lodash/collection'

export default {
  name: 'HelloHome',
  data: () => ({
    dialog: false,
    showPassword: false,
    admin: {
      id: '',
      pwd: ''
    },
    headers: [],
    bodies: []
  }),
  computed: {
    ...mapGetters([
      'isAuth',
      'admins',
      'authInfo'
    ])
  },
  async created () {
    await this.$store.dispatch('fetchAdmins')
    this.$nextTick(() => {
      const b = []
      this.headers = map(this.admins, (a) => {
        b.push(a.admin_id)
        return { text: a.admin_name, value: a.admin_id, sortable: false }
      })
      this.bodies.push(b)
    })
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch(LOGIN_ADMIN, this.admin)
        this.$showSnackBar('관리자로 확인되었습니다.')
      } catch (e) {
        this.$showSnackBar('등록되지 않은 관리자입니다. ID나 비밀번호를 다시 확인해주세요.')
      }

      this.$nextTick(() => {
        this.dialog = false
      })
    },
    logout () {
      if (confirm('로그아웃하시겠습니까?')) {
        this.$store.commit(REMOVE_AUTH)
        this.$store.commit(SET_CHANGED_CODE, {type: 'rl_ac', code: null})
        this.$store.commit(SET_CHANGED_CODE, {type: 'vl_ac', code: null})
      }
    },
    onLogin (id) {
      this.admin.id = id
      this.admin.pwd = ''
      this.dialog = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  th, td {
    border: 1px solid !important;
  }
  td {
    cursor: pointer;
  }
  .admin-table {
    overflow-x: auto;
    width: 730px;
    padding: 0 5px;
  }
</style>
