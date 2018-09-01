<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs9 sm3 d-flex>
        <v-select label="교구 코드" v-model="areaCode.la_code"
                  :items="lAreaCodes" item-text="l_name" item-value="l_code"
        ></v-select>
      </v-flex>
      <v-flex xs9 sm3 d-flex>
        <v-select label="지구 코드" v-model="areaCode.ma_code" no-data-text="지구 자료가 없습니다."
                  :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
        ></v-select>
      </v-flex>
      <v-flex xs9 sm3 d-flex>
        <v-select label="본당 코드" v-model="areaCode.sa_code" no-data-text="본당 자료가 없습니다."
                  :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs10 sm10 offset-sm1>
        <v-card>
          <v-list>
            <v-radio-group v-model="selected" :mandatory="false">
            <template v-for="(item, index) in items" v-if="item.l_code !== ''">
              <v-list-tile :key="index" ripple>
                <v-list-tile-action>
                  <v-radio :value="index"></v-radio>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ `${item.l_name} (${item.l_code})` }}</v-list-tile-title>
                </v-list-tile-content>

              <!--  <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
                  <v-icon v-if="selected.indexOf(index) < 0" color="grey lighten-1"
                  >
                    star_border
                  </v-icon>

                  <v-icon v-else color="yellow darken-2"
                  >
                    star
                  </v-icon>
                </v-list-tile-action>
-->
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="item.l_code + index"></v-divider>
            </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs10 sm1>
        <inline-buttons refs="code"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CodeMixin from '@/common/code.mixin'
import InlineButtons from './control/InlineButtons'

export default {
  name: 'AreaCode',
  mixins: [ CodeMixin ],
  components: { InlineButtons },
  data: () => ({
    items: [],
    selected: '01'
  }),
  mounted () {
    this.items = this.lAreaCodes
  },
  methods: {
    toggle (index) {
      const i = this.selected.indexOf(index)
      if (i > -1) {
        this.selected.splice(i, 1)
      } else {
        this.selected.push(index)
      }
    },
    onSelect (type, val) {
      console.log(type, val)
    }
  }
}
</script>

<style scoped>
</style>
