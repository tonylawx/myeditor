<template>
  <VueEditor v-model:htmlValue="res.text"/>
  <el-button @click="handleSave">保存</el-button>
</template>

<script setup lang="ts">
import { VueEditor } from './components/vue-editor';
import {defineProps, reactive, ref, watch} from "vue";
import fieldProps from "../../utils/fieldProps";
import {useAddField} from "@tmagic/form";
import {cloneDeep} from "lodash-es";
import {MTextCom} from "../../../../bwComponentType";
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
  text:''
},cloneDeep(props.model[props.name]))) as MTextCom
const handleSave=()=>{
  emit('change',res)
}
</script>
<script lang="ts">
export default {
  name: 'm-fields-rich-text',
};
</script>

<style scoped></style>
