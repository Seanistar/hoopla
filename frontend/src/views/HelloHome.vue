<template>
  <div>
    <v-container>
      <v-text-field label="Catholic Bible Life Movement"></v-text-field>
      <v-layout>
        <v-flex xs4>
          <v-img src="../static/bible.jpeg" height="400" aspect-ratio="1.5"></v-img>
        </v-flex>
        <v-flex xs8>
          <v-responsive>
            <v-container fill-height>
              <v-layout align-center>
                <v-flex xs12 class="pl-2">
                  <h4 class="display-1 bp-10">환영합니다.</h4>
                  <span class="subheading">주님의 은총으로 말씀 봉사의 부르심에 응답하는 봉사자들을 효과적으로 관리하고 지원하기 위한 프로그램입니다.</span><br/>
                  <span class="subheading">봉사자들의 그룹공부, 연수현황, 월교육, 재교육, 특강, 피정, 전출입, 노트검사 및 보완 교육 등을 체계적으로 정리하여 성서모임 수녀님들이 함께 공유하는 데 목적이 있습니다.</span>
                  <v-divider class="my-3"></v-divider>
                  <div class="title mb-3">관리자 계정으로 로그인하세요!</div>
                  <v-btn class="mx-0" color="brown darken-2" large outline @click="dialog = true">Login</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-responsive>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>관리자 로그인</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 아이디</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="ID" clearable required v-model="admin.name"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 암호</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="Password" v-model="admin.pwd" required
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
          <v-btn color="primary" flat @click="dialog = false">취소</v-btn>
          <v-btn color="primary" flat @click="login">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {LOGIN_ADMIN} from '@/store/actions.type'

export default {
  name: 'HelloHome',
  data: () => ({
    dialog: false,
    showPassword: false,
    admin: {
      name: 'seangrit',
      pwd: '6397'
    },
    gradient: 'to top, #D7CCC8, #6D4C41'
  }),
  methods: {
    async login () {
      await this.$store.dispatch(LOGIN_ADMIN, this.admin)
      if (this.$store.getters.isLogin) {
        alert('관리자로 확인되었습니다.')
      } else {
        alert('등록되지 않은 관리자입니다.')
      }
      this.dialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
