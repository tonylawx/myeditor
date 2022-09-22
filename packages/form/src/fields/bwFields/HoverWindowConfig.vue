<style scoped lang="scss">
</style>
<template>
  <div>
    <el-form>
      <el-form-item label="选择图片">
        <el-upload>
          <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片跳转">
        <el-button >选择链接</el-button>
      </el-form-item>
      <el-form-item label="距离底部">
          <el-slider v-model="res.bottomDis" max="150"/>px
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, ref,watch} from 'vue';
import fieldProps from '../../utils/fieldProps';
import { useAddField } from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import {MFloatCom} from "../../../../bwComponentType";
import { Plus } from '@element-plus/icons-vue'

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
  bgUrl: '',
  link: {
    type: 'MiniProgram',
    appId: '',
    url: ''
  },
  bottomDis: ''
},cloneDeep(props.model[props.name]))) as MFloatCom
// table实例
// 对话框flag
const dialogVisible = ref(false);
watch(res, (value) => {
  emit('change',value)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-hover-window-config',
};
</script>
