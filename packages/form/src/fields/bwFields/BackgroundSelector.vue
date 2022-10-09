<template>
  <div>
    <el-row>
      <el-radio-group v-model="res.type">
        <el-radio label="color">纯色</el-radio>
        <el-radio label="image">图片</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-color-picker v-if="res.type === 'color'" v-model="res.bgColor" :showAlpha="true" />
      <UploadCustom v-else :showCropper="false"  text="上传图片" :limit="1" urlModel v-model:url="res.bgImg"/>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, reactive, watch} from 'vue';
import {cloneDeep} from 'lodash-es';

import fieldProps from '../../utils/fieldProps';
import {useAddField} from '../../utils/useAddField';

import {UploadCustom} from './components/upload-custom';


const props = defineProps({
  ...fieldProps,
  config: {
    type: Object,
    default: () => {},
  },
});
useAddField(props.prop);
const res = reactive(Object.assign(
  {},
  {
    type: 'color',
    bgColor: '',
    bgImg: '',
  },
  cloneDeep(props.model[props.name]),
));
const emit = defineEmits(['change'])
watch(res, (value) => {
  emit('change',value)
})
</script>
<script lang="ts">
export default {
  name: 'm-fields-background-selector',
};
</script>

<style scoped></style>
