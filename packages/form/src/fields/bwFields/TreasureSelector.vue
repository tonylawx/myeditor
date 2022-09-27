<style scoped lang="scss">
.goods-selector {
  &__add-group {
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    > div {
      display: flex;
      justify-content: center;
    }
  }
  &__groups {
    &__item {
      margin-top: 10px;
      position: relative;
      &__delete {
        font-size: 12px;
        position: absolute;
        right: 0px;
        top: 0px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
      }
    }
  }
}
</style>
<template>
  <div class="goods-selector">
    <el-form label-position="left" :label-width="120">
      <el-form-item label="商品展示样式">
        <el-radio-group v-model="res.comType">
          <el-radio label="list"> 列表 </el-radio>
          <el-radio label="slide"> 侧滑 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <TreasureSortSelector />
  </div>
</template>
<script lang="ts" setup>
import TreasureSortSelector from "./components/TreasureSortSelector.vue";
import { defineProps, reactive, watch } from "vue";
import fieldProps from "../../utils/fieldProps";
import { useAddField } from "../../utils/useAddField";
import { cloneDeep } from "lodash-es";
import { MTreasureCom} from "./bwComponentType";

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
     comType:'list',
      compId:''
    },
    cloneDeep(props.model[props.name])
  )
) as MTreasureCom;

watch(res, (value) => {
  emit("change", value);
});
</script>

<script lang="ts">
export default {
  name: "m-fields-treasure-selector",
};
</script>
