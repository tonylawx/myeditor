<style scoped lang="scss">
</style>
<template>
  <div>
    <el-form>
      <el-form-item label="标题文案">
        <el-button>上传视频</el-button>
        <span>视频建议大小为：1920*1080, 视频比例是16:9</span>
      </el-form-item>
      <el-form-item label="视频图片">
        <el-upload></el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, ref,watch} from 'vue';
import fieldProps from '../../utils/fieldProps';
import { useAddField } from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import { MVideoCom} from "../../../../bwComponentType";

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
  url: '',
  bgUrl: ''
},cloneDeep(props.model[props.name]))) as MVideoCom
// table实例
// 对话框flag
const dialogVisible = ref(false);
watch(res, (value) => {
  emit('change',value)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-video-config',
};
</script>
