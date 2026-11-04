<template>
  <div class="fullscreen bg-green-8 text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 25vh">
        404
      </div>

      <div class="text-h4" style="opacity:.8">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="green-9"
        unelevated
        to="/"
        label="Go Home"
        icon="home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
