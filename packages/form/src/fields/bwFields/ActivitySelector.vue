<template>
<el-select v-model="model[name]" filterable>
  <el-option v-for="item in options" :label="item.activityName" :key="item.id" :value="item.id"/>
</el-select>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, ref} from "vue";
import fieldProps from "../../utils/fieldProps";
import {useAddField} from '../../utils/useAddField';
import {getActEnum} from "../../../../../playground/src/services/editor";

const props = defineProps({
  ...fieldProps,
  config:{
    type:Object,
    default:()=>{}
  }
});
useAddField(props.prop);

const options = ref<{
  activityName:string
  id:string
}[]>([])
onMounted(()=>{
  getActEnum().then(res=>{
    options.value = res
  })
})
</script>
<script lang="ts">
export default {
  name: 'm-fields-activity-selector',
};
</script>

<style scoped>

</style>
