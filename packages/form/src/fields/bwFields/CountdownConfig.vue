<style scoped lang="scss">
</style>
<template>
  <div>
    <el-form>
      <el-form-item label="开始时间">
          <el-date-picker type="datetime" v-model="res.startTime"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker type="datetime" v-model="res.endTime"/>
      </el-form-item>
      <el-form-item label="活动名称">
          <el-input v-model="res.activityName"/>
      </el-form-item>
      <el-form-item label="展示样式">
        <el-radio-group v-model="res.styleType">
          <el-radio label="light">
            浅色
          </el-radio>
          <el-radio label="deep">
            深色
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {defineProps, reactive, ref, watch} from 'vue';
import fieldProps from '../../utils/fieldProps';
import {useAddField} from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import {MCountCom} from "./bwComponentType";

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
  startTime: '',
  endTime: '',
  activityName: '',
  styleType:'light'
},cloneDeep(props.model[props.name]))) as MCountCom
// table实例
// 对话框flag
const dialogVisible = ref(false);
watch(res, (value) => {
  const tmp = cloneDeep(value)
 if(tmp.startTime) tmp.startTime = new Date(tmp.startTime).getTime()
  if(tmp.endTime)tmp.endTime = new Date(tmp.endTime).getTime()
  emit('change',tmp)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-countdown-config',
};
</script>
