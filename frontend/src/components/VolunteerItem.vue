<template>
  <v-form>
    <v-container>
      <v-tabs left>
        <v-tab v-for="(item, idx) in title" :key="idx">{{ item.text }}</v-tab>
      </v-tabs>

      <v-text-field label="봉사자 추가" single-line readonly class="sub-title"></v-text-field>
      <v-spacer></v-spacer>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
                  box
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
                  box
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
                  outline
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
                  outline
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-divider class="v-space"></v-divider>
      <v-text-field label="봉사 활동 정보" single-line readonly class="sub-title"></v-text-field>
      <v-spacer></v-spacer>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
                  box
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
                  box
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your product or service"
                  value="Grocery delivery"
                  hint="For example, flowers or used cars"
                  outline
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm6>
          <v-text-field
                  label="Your landing page"
                  hint="www.example.com/page"
                  persistent-hint
                  outline
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-divider class="v-space"></v-divider>
    </v-container>
  </v-form>
  <!--  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card ref="form">
        <v-card-text>
          <v-text-field
                  ref="name"
                  v-model="name"
                  :rules="[() => !!name || 'This field is required']"
                  :error-messages="errorMessages"
                  label="Full Name"
                  placeholder="John Doe"
                  required
          ></v-text-field>
          <v-text-field
                  ref="address"
                  :rules="[
                  () => !!address || 'This field is required',
                  () => !!address && address.length <= 25 || 'Address must be less than 25 characters',
                  addressCheck]"
                  v-model="address"
                  label="Address Line"
                  placeholder="Snowy Rock Pl"
                  counter="25"
                  required
          ></v-text-field>
          &lt;!&ndash;<v-text-field
                  ref="city"
                  :rules="[() => !!city || 'This field is required', addressCheck]"
                  v-model="city"
                  label="City"
                  placeholder="El Paso"
                  required
          ></v-text-field>
          <v-text-field
                  ref="state"
                  v-model="state"
                  :rules="[() => !!state || 'This field is required']"
                  label="State/Province/Region"
                  required
                  placeholder="TX"
          ></v-text-field>
          <v-text-field
                  ref="zip"
                  :rules="[() => !!zip || 'This field is required']"
                  v-model="zip"
                  label="ZIP / Postal Code"
                  required
                  placeholder="79938"
          ></v-text-field>
          <v-autocomplete
                  ref="country"
                  :rules="[() => !!country || 'This field is required']"
                  :items="countries"
                  v-model="country"
                  label="Country"
                  placeholder="Select..."
                  required
          ></v-autocomplete>&ndash;&gt;
        </v-card-text>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn flat>Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip v-if="formHasErrors" left>
              <v-btn slot="activator" icon class="my-0" @click="resetForm">
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Refresh form</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn color="primary" flat @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>-->
</template>

<script>
import { isEmpty } from 'lodash/lang'

export default {
  name: 'VoltItem',
  props: {
    volt: { type: Object }
  },
  computed: {
    form () {
      return {
        name: this.name,
        address: this.address
      }
    }
  },
  data: () => ({
    formHasErrors: false,
    errorMessages: '',
    name: null,
    address: null,
    title: [
      { text: '봉사자 기본 정보', link: '' },
      { text: '봉사자 교육 현황', link: '' },
      { text: '봉사자 활동 내역', link: '' }
      ]
  }),
  created () {
    console.log(isEmpty(this.volt))
  },
  methods: {
    resetForm () {
      this.errorMessages = []
      this.formHasErrors = false

      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset()
      })
    },
    submit () {
      this.formHasErrors = false

      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true

        this.$refs[f].validate(true)
      })
    }
  }
}
</script>

<style scoped>
  .v-space {
    margin: 10px 0;
  }
  .vb-padding {
    padding-bottom: 10px;
  }
</style>
