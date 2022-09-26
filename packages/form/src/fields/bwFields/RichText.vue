<template>
  <VueEditor v-model:htmlValue="res.text" />
  <el-button @click="handleSave">保存</el-button>
</template>

<script setup lang="ts">
import { defineProps, reactive } from 'vue';
import { cloneDeep } from 'lodash-es';

import { useAddField } from '../../utils/useAddField';

import { MTextCom } from './bwComponentType';
import fieldProps from '../../utils/fieldProps';

import { VueEditor } from './components/vue-editor';
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object,
    default: () => {},
  },
});

useAddField(props.prop);
const emit = defineEmits(['change']);
const res = reactive(
  Object.assign(
    {},
    {
      text: '',
    },
    cloneDeep(props.model[props.name]),
  ),
) as MTextCom;
const handleSave = () => {
  emit('change', res);
};
</script>
<script lang="ts">
export default {
  name: 'm-fields-rich-text',
};
</script>

<style scoped></style>
