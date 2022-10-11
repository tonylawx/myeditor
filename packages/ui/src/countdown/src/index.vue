<style lang="scss" scoped>
.com{
 background: #007acc;text-align: center;padding-top: 20px
}
</style>
<template>
<!--  <div>-->
<!--    <div v-for="(item, index) in fieldNames" :key="index">-->
<!--      {{ item }}:-->
<!--      <pre>{{ JSON.stringify(config[item], null, 4) }}</pre>-->
<!--    </div>-->
<!--  </div>-->
  <div  class="com">
    倒计时组件
  </div>
</template>
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
