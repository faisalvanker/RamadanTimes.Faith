<template>
  <div>
    <div class="q-pa-md">
      <div class="text-h5 text-weight-bold">Welcome</div>
      <div class="q-gutter-y-md">
        <div class="text-body1">
          Ramadan Times is an interactive mobile web application that allows Muslim's in South Africa to keep track of Fasting Times.
        </div>
        <div class="text-body1">
          In sha Allah this application will be useful during this difficult time as we are forced to pray at home. </div>
        <div class="text-body1">
          Click the button below to get started
        </div>
        <q-btn
          align="between"
          color="primary"
          class="btn-fixed-width"
          label="Preferences"
          icon="settings"
          @click="RedirectToSettings"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    RedirectToSettings () {
      this.$router.push('/Settings')
    }
  }
}
</script>
