<template>
  <div>
    商品数据:
    <pre>{{ JSON.stringify(config.goods, null, 4) }}</pre>
    <pre>{{ JSON.stringify(config.goods1, null, 4) }}</pre>
  </div>
</template>
<script lang="ts"></script>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  model: {
    type: Object,
    default: () => ({}),
  },
});
</script>
