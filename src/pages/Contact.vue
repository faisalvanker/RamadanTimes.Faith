<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold">Send us a Message</div>
    <div class="q-gutter-y-md">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="name"
          label="Your name *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter your name']"
        />

        <q-input
          filled
          type="email"
          v-model="email"
          label="email address*"
          lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Please type your email address',
        ]"
        />
        <q-input
          filled
          type="textarea"
          v-model="message"
          label="Message*"
          lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Please enter a message'
        ]"
        />

        <div>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { VueReCaptcha } from 'vue-recaptcha-v3'

Vue.use(VueReCaptcha, { siteKey: 'xxxxxxxxxxxxxxxxxx' })
export default {
  name: 'Contact',
  data () {
    return {
      name: '',
      email: '',
      message: ''

    }
  },
  methods: {
    onSubmit () {
      this.$recaptcha('Contact').then(token => {
        axios.post('https://ramadantimes.azurewebsites.net/api/SendEmail', {
          name: this.name,
          email: this.email,
          message: this.message,
          recaptcha: token
        })
          .then((response) => {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Message Sent'
            })
            this.$router.push('/')
          }, (error) => {
            this.$q.notify({
              color: 'red-4',
              textColor: 'white',
              message: 'Message Failed To Send ' + error
            })
          })
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          message: 'Error with Captcha'
        })
      })
    },

    onReset () {
      this.name = ''
      this.email = ''
      this.message = ''
    }
  }
}
</script>
