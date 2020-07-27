<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h4">Tasbeeh
            <q-btn
              flat
              color="primary"
              size="md"
              icon="refresh"
              @click="ConfirmReset()"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h1 text-center">
            {{ counter }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-btn
        color="primary"
        size="xl"
        icon="remove_circle_outline"
        @click="Decrease()"
      />
      <q-btn
        color="primary"
        size="xl"
        icon="add_circle_outline"
        @click="Increase()"
      />

    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Tasbee',
  data () {
    return {
      counter: this.$q.localStorage.getItem('tasbee') ?? 0
    }
  },
  methods: {
    Increase: function (event) {
      this.counter++
      this.Persist()
    },
    Decrease: function (event) {
      if (this.counter > 0) {
        this.counter--
        this.Persist()
      }
    },
    Reset: function (event) {
      this.counter = 0
      this.Persist()
    },
    Persist: function () {
      try {
        this.$q.localStorage.set('tasbee', this.counter)
      } catch (e) {
        // data wasn't successfully saved due to
        // a Web Storage API error
      }
    },
    ConfirmReset () {
      this.$q.dialog({
        title: 'Reset Tasbeeh Counter',
        message: 'Are you sure you want to continue?',
        position: 'bottom',
        cancel: true
      }).onOk(() => {
        this.Reset()
      }).onCancel(() => {
        // console.log('Cancel')
      })
    }
  }
}
</script>
