<template>
<!--  <div>-->
<!--    <div v-for="(item, index) in fieldNames" :key="index">-->
<!--      {{ item }}:-->
<!--      <pre>{{ JSON.stringify(config[item], null, 4) }}</pre>-->
<!--    </div>-->
<!--  </div>-->
  <div class="com">
    悬浮窗组件
  </div>
</template>
<style scoped lang="scss">
.com{
  background: #00ff00;
  text-align: center;
  padding-top: 20px
}
</style>
<script setup lang="ts">
import {defineProps} from 'vue';

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
