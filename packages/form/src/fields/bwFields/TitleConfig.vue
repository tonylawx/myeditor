<style scoped lang="scss">
</style>
<template>
  <div>
    <el-form>
      <el-form-item label="标题文案">
        <el-input v-model="res.title"></el-input>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-radio-group v-model="res.fontSize">
          <el-radio-button label="small">小</el-radio-button>
          <el-radio-button label="middle">中</el-radio-button>
          <el-radio-button label="big">大</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="res.fontColor"></el-color-picker>
        {{res.fontColor}}
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="res.bgColor"></el-color-picker>
        {{res.bgColor}}
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, ref,watch} from 'vue';
import fieldProps from '../../utils/fieldProps';
import { useAddField } from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import {MTitleCom} from "./bwComponentType";

const props = defineProps({
  ...fieldProps,
  config:{
    type:Object,
    default:()=>{}
  }
});

useAddField(props.prop);
const emit = defineEmits(['change'])

const res = reactive(Object.assign({},{
  title:'',
  fontSize:'',
  fontColor:'',
  bgColor:''
},cloneDeep(props.model[props.name]))) as MTitleCom
// table实例
// 对话框flag
const dialogVisible = ref(false);
watch(res, (value) => {
  emit('change',value)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-title-config',
};
</script>
