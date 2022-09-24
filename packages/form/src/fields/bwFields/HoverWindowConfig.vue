<style scoped lang="scss"></style>
<template>
  <div>
    <el-form>
      <el-form-item label="选择图片">
        <UploadCustom
          :showCropper="false"
          text="上传图片"
          :limit="1"
          urlModel
          v-model:url="res.bgUrl"
        />
      </el-form-item>
      <el-form-item label="图片跳转">
        <LinkSelector v-model:link-option="res.link" />
      </el-form-item>
      <el-form-item label="距离底部">
        <div style="display: flex;justify-content: space-between;width: 200px;">
          <el-slider v-model="res.bottomDis" max="150" style="width: 80%"/>px
        </div>
        <div>建议距离150像素</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, ref, watch } from "vue";
import fieldProps from "../../utils/fieldProps";
import { useAddField } from "../../utils/useAddField";
import { cloneDeep } from "lodash-es";
import { MFloatCom } from "../../../../bwComponentType";
import LinkSelector from "./components/LinkSelector.vue";
import { UploadCustom } from "./components/upload-custom";

const props = defineProps({
  ...fieldProps,
  config: {
    type: Object,
    default: () => {},
  },
});

useAddField(props.prop);
const emit = defineEmits(["change"]);

const res = reactive(
  Object.assign(
    {},
    {
      bgUrl: "",
      link: {
        type: "MiniProgram",
        appId: "",
        url: "",
      },
      bottomDis: "",
    },
    cloneDeep(props.model[props.name])
  )
) as MFloatCom;
// table实例
// 对话框flag
const dialogVisible = ref(false);
watch(res, (value) => {
  emit("change", value);
});
</script>

<script lang="ts">
export default {
  name: "m-fields-hover-window-config",
};
</script>
