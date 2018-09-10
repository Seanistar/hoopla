<template>
  <v-container pa-0 mt-4>
    <v-layout row wrap>
      <v-flex xs4>
        <v-subheader class="subheading"><span class="mr-3">선서연도 :</span>
          <v-flex xs3><v-text-field label="2014" value="" single-line suffix="년"></v-text-field></v-flex>
        </v-subheader>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="items" hide-actions
                  class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-for="header in props.headers" :key="header.code"
              class="align-center"
          >{{ header.name }}
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">현황 내역이 없습니다.</div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>

export default {
  name: 'QueryActs',
  computed: {
    headers () {
      let heads = [{name: '연도', code: 10}]
      return heads.concat(this.$store.getters.actCodes)
    }
  },
  data: () => ({
    items: []
  })
}
</script>

<style scoped>
</style>
