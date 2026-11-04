<template>
  <q-item
    clickable
    tag="a"
    :href="link"
    :class="isActive ? 'bg-green-1 text-green-10 text-weight-bold' : ''"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" :color="isActive ? 'green-9' : 'grey-8'" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption :class="isActive ? 'text-green-9' : ''">
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
  computed: {
    isActive() {
      if (!this.link || !this.link.startsWith("#/")) return false;
      const targetPath = this.link.slice(1);
      return this.$route && this.$route.path.toLowerCase() === targetPath.toLowerCase();
    },
  },
};
</script>
