<template>
  <div class="tp-10">
    <v-data-table
      :headers="headers"
      :items="desserts"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="text-xs-right">{{ props.item.iron }}</td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          교육 상황 내역이 없습니다.
        </v-alert>
      </template>
    </v-data-table>
    <div class="fl-r tp-10">
      <v-tooltip bottom>
        <v-btn fab outline dark small color="cyan" slot="activator">
          <v-icon dark>edit</v-icon>
        </v-btn>
        <span>수정</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn fab outline dark small color="cyan" slot="activator">
          <v-icon dark>delete</v-icon>
        </v-btn>
        <span>삭제</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn fab outline dark small color="cyan" slot="activator">
          <v-icon dark>add</v-icon>
        </v-btn>
        <span>추가</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VolunteerEdus',
  data: () => ({
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' }
    ],
    desserts: [
      {
        value: false,
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%'
      }
    ]
  })
}
</script>

<style scoped>
</style>
