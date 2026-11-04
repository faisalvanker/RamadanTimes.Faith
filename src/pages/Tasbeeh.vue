<template>
  <q-page class="flex flex-center column">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        class="my-card cursor-pointer select-none"
        style="min-width: 260px"
        v-ripple
        @click="Increase()"
      >
        <q-card-section class="row items-center justify-between">
          <div class="text-h5 text-weight-bold">Tasbeeh</div>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="refresh"
            aria-label="Reset Counter"
            @click.stop="ConfirmReset()"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-py-lg">
          <div class="text-h1 text-center text-weight-bold text-primary">
            {{ counter }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md row items-center q-gutter-lg">
      <q-btn
        round
        outline
        color="primary"
        size="lg"
        icon="remove"
        aria-label="Decrease"
        @click="Decrease()"
      />
      <q-btn
        round
        color="primary"
        size="xl"
        icon="add"
        aria-label="Increase"
        @click="Increase()"
      />
    </div>
  </q-page>
</template>

<script>
import { STORAGE_KEYS } from "src/constants/appConfig";

export default {
  name: "TasbeePage",
  data() {
    return {
      counter: this.$q.localStorage.getItem(STORAGE_KEYS.TASBEEH) ?? 0,
    };
  },
  methods: {
    Increase: function () {
      this.counter++;
      this.Vibrate(15);
      this.Persist();
    },
    Decrease: function () {
      if (this.counter > 0) {
        this.counter--;
        this.Vibrate(10);
        this.Persist();
      }
    },
    Reset: function () {
      this.counter = 0;
      this.Persist();
    },
    Vibrate: function (ms) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(ms);
        } catch (e) {
          // ignore vibration errors on unsupported browsers
        }
      }
    },
    Persist: function () {
      try {
        this.$q.localStorage.set(STORAGE_KEYS.TASBEEH, this.counter);
      } catch (e) {
        // data wasn't successfully saved due to
        // a Web Storage API error
      }
    },
    ConfirmReset() {
      this.$q
        .dialog({
          title: "Reset Tasbeeh Counter",
          message: "Are you sure you want to continue?",
          position: "bottom",
          cancel: true,
        })
        .onOk(() => {
          this.Reset();
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
  },
};
</script>

<style scoped>
.select-none {
  user-select: none;
}
</style>
