<template>
  <div>
    <div v-for="(item, index) in fieldNames" :key="index">
      {{ item }}:
      <pre>{{ JSON.stringify(config[item], null, 4) }}</pre>
    </div>
  </div>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { defineProps } from 'vue';

import formConfig from './formConfig';

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
const fieldNames = formConfig.map((item) => item.name);
</script>
