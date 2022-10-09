<template>
<!--  <div>-->
<!--    <div v-for="(item, index) in fieldNames" :key="index">-->
<!--      {{ item }}:-->
<!--      <pre>{{ JSON.stringify(config[item], null, 4) }}</pre>-->
<!--    </div>-->
<!--  </div>-->
  <div style="background: #722ed1;text-align: center;padding-top: 20px" >
    视频组件
  </div>
</template>
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
const fieldNames = formConfig.map(item => item.name);
</script>
