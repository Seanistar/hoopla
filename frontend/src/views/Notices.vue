<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-expansion-panel popout>
          <v-expansion-panel-content
            v-for="(item, i) in items" :key="i">
            <div slot="header">{{item.title}}</div>
            <v-card>
              <v-card-text>{{item.desc}}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'HomeNotices',
  data: () => ({
    items: [
      {title: '(2018년 08월 30일) 프로그램 데모 시연 안내', desc: '오늘 본당에서 성서모임 프로그램 데모 시연이 있습니다.'},
      {title: '(2018년 08월 26일) 기도하세요', desc: '열심히 기도해면 천국갈 수 있을지도 모릅니다. 허나 저는 글렀습니다.'},
      {title: '(2018년 08월 04일) 성경 공부 과목 안내', desc: '그룹 공부, 연수 현황, 노트 검사 및 보완 교육, 피정 등이 있습니다.'}
    ]
  })
}
</script>

<style scoped>
</style>
