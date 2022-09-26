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
        <el-radio-group v-model="res.goodComItem.comType">
          <el-radio label="column"> 双列 </el-radio>
          <el-radio label="list"> 列表 </el-radio>
          <el-radio label="slide"> 侧滑 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <GoodSortSelect hint="最小限2个商品，最大限20个商品"/>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, watch } from "vue";
import fieldProps from "../../utils/fieldProps";
import { useAddField } from "../../utils/useAddField";
import { cloneDeep } from "lodash-es";
import GoodSortSelect from "./components/GoodSortSelector.vue";
import {MGoodCom} from "./bwComponentType";

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
      goodComItem:{
        compId: '', // 获取商品组件数据的ID
        comType:'list'
      }
    },
    cloneDeep(props.model[props.name])
  )
) as MGoodCom;

watch(res, (value) => {
  emit("change", value);
});
</script>

<script lang="ts">
export default {
  name: "m-fields-goods-list-selector",
};
</script>
