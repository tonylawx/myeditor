<style scoped lang="scss">
.com {
  background: #2f54eb;
  text-align: center;
  padding-top: 20px;
  width:100%;
  height: 200px;
}
</style>
<template>
<!--  <div>-->
<!--    <div v-for="(item, index) in fieldNames" :key="index">-->
<!--      {{ item }}:-->
<!--      <pre>{{ JSON.stringify(config[item], null, 4) }}</pre>-->
<!--    </div>-->
<!--  </div>-->
  <div class="com"  >
    商品热榜组件
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
