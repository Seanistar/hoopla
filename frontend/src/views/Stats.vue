<template>
  <v-container pt-0>
    <v-tabs align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(text, idx) in titles" :key="idx" @click="tabIdx = idx">
        <strong>{{ text }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout :class="[window.width <= 900 ? 'mt-2' : 'mt-4']" pt-0 class="elevation-3">
      <component :is="targetComponents[tabIdx]" />
    </v-layout>
    <!--<float-button path="stats"/>-->
  </v-container>
</template>

<script>
import StatYearly from '@/components/StatYearly'
import StatChurch from '@/components/StatChurch'
import StatArea from '@/components/StatArea'
import StatVolt from '@/components/StatVolts'
import StatActs from '@/components/StatActs'
import StatOthers from '@/components/StatOthers'
import StatLeaders from '@/components/StatLeaders'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'Stats',
  components: { StatYearly, StatChurch, StatArea, StatVolt, StatActs, StatOthers, StatLeaders, FloatButton },
  computed: {
    targetComponents () {
      return ['StatArea', 'StatYearly', 'StatChurch', 'StatVolt', 'StatActs', 'StatOthers', 'StatLeaders']
    }
  },
  data: () => ({
    tabIdx: 0,
    window: {
      width: 0,
      height: 0
    },
    titles: ['교구별 현황', '연도별 현황', '본당별 현황',
      '전체 봉사자 현황', '봉사 활동 현황', '타 본당 봉사 현황', '대표 봉사자 현황']
  }),
  created () {
    this.window.width = window.innerWidth
    this.window.height = window.innerHeight
  }
}
</script>

<style scoped>
</style>

<style>
  @media screen and (max-width: 900px) {
    .data-column th {
      width: 80px !important;
    }
    .main-table .v-table__overflow table.v-table {
      width: 1800px !important;
      overflow-x: auto;
    }
    .acts-table .v-table__overflow table.v-table {
      width: 1400px !important;
      overflow-x: auto;
    }
    .w-5 { width: 5% !important; }
  }
</style>

<style lang="scss">
  .fixed-header {
    display: flex;
    flex-direction: column;
    height: 100%;

    .theme--light.v-table tbody td:first-child {
      background-color: lightgrey;
    }
    table.v-table thead tr {
      height: 40px;
    }
    th {
      border-right: 1px solid grey;
    }
    td {
      border: 1px solid grey;
    }
    th, td {
      max-width: 50px !important;
      min-width: 25px !important;
      padding: 0 3px !important;
      text-align: center;
    }
    .head-title {
      white-space: normal;
      margin-bottom: 0 !important;
    }
    table {
      table-layout: fixed;
      width: calc(92vw - 30px) !important;
    }
    .first-row th {
      position: sticky;
      top: 0;
      z-index: 6;
    }
    .first-row th:first-child {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 7;
    }
    .second-row th {
      position: sticky;
      top: 40px;
      z-index: 6;
      border-top: 1px solid grey;
    }
    .third-row th {
      position: sticky;
      top: 80px;
      z-index: 6;
      border-top: 1px solid grey;
    }
    .first-column td:first-child {
      position: sticky;
      z-index: 5;
      left: 0;
    }
    tr.v-datatable__progress {
      th {
        height: unset !important;
      }
    }
    .v-table__overflow {
      flex-grow: 1;
      flex-shrink: 1;
      overflow-x: auto;
      overflow-y: auto;
    }
    .v-datatable.v-table {
      flex-grow: 0;
      flex-shrink: 1;
      .v-datatable__actions {
        flex-wrap: nowrap;
        .v-datatable__actions__pagination {
          white-space: nowrap;
        }
      }
    }
  }
</style>
