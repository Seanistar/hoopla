<template>
  <div>
    <v-text-field label=""></v-text-field>
    <v-jumbotron :gradient="gradient" dark>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">환영합니다.</h3>
            <span class="subheading">말씀 봉사의 부르심에 응답하는 봉사자들을 효과적으로 관리하고 지원하는 프로그램입니다.
              봉사자들의 그룹공부, 연수현황, 그룹봉사, 특강, 피정, 전출입, 쉼, 노트검사 및 보완 교육 등을 체계적으로 정리하여 성서모임 수녀님들이 함께 공유하는 데 목적이 있습니다.</span>
            <v-divider class="my-3"></v-divider>
            <div class="title mb-3">관리자 계정으로 로그인하세요!</div>
            <v-btn class="mx-0" color="deep-purple accent-2" large @click="dialog = true">Login</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>관리자 로그인</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 아이디</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="ID" clearable></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>관리자 암호</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                            @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">취소</v-btn>
          <v-btn color="primary" flat @click="dialog = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'HelloHome',
  data: () => ({
    dialog: false,
    showPassword: false,
    gradient: 'to top, #7B1FA2, #E1BEE7'
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
