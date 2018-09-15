<template>
  <div class="pt-4">
    <v-container style="width: 80%">
      <v-layout row wrap>
        <v-flex xs12>
          <v-expansion-panel popout class="elevation-5">
            <v-expansion-panel-content
              v-for="(item, i) in items" :key="i">
              <div slot="header"><span>{{item.title}}</span><span class="f pr-3">{{item.date}}</span></div>
              <v-card>
                <v-card-text>{{item.desc}}</v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomeNotices',
  data: () => ({
    items: [
      {title: '(5) 프로그램 데모 시연 안내', date: '2018년 8월 31일', desc: '오늘 본당에서 성서모임 프로그램 데모 시연이 있습니다. 많은 관심 부탁 드립니다.'},
      {title: '(4) 활동 중단 봉사자에 대한 안내 가이드', date: '2018년 8월 26일', desc: '열심히 공부해서 신앙의 양식을 쌓으세요.'},
      {title: '(3) 마르지 않는 샘 - 와서 보라', date: '2018년 8월 8일', desc: '(1요한1, 39) 하느님의 집에 사는 것이 얼마나 행복하오리까? 주님만이 저의 임금이시며 하느님이시기 때문이옵니다.'},
      {title: '(2) 거기서 나를 보게 될 것이다', date: '2018년 7월 19일', desc: '수도원의 뜨락으로 초대합니다. 성모님을 통하여 무거운 짐을 가볍게 내려 주시는 주님의 사랑을 체험하십시오.'},
      {title: '(1) 성경 공부 과목 안내', date: '2018년 7월 4일', desc: '그룹 공부, 연수 현황, 노트 검사 및 보완 교육, 피정 등이 있습니다.'}
    ]
  })
}
</script>

<style scoped>
</style>
