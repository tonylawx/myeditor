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
      <el-form-item label="分组名称未选中颜色">
        <el-color-picker v-model.lazy="res.groupNameUnPicked" />
        {{ res.groupNameUnPicked }}
      </el-form-item>
      <el-form-item label="分组名称选中颜色">
        <el-color-picker v-model.lazy="res.groupNamePicked" />
        {{ res.groupNamePicked }}
      </el-form-item>
      <el-form-item label="分组底色未选中颜色">
        <el-color-picker v-model.lazy="res.groupBgUnPicked" />
        {{ res.groupBgUnPicked }}
      </el-form-item>
      <el-form-item label="分组底色选中颜色">
        <el-color-picker v-model.lazy="res.groupBgPicked" />
        {{ res.groupBgPicked }}
      </el-form-item>
    </el-form>
    <div class="goods-selector__groups">
      <el-card
        v-for="(item, index) in res.groupGoodCom"
        :key="index"
        class="goods-selector__groups__item"
      >
        <div class="goods-selector__groups__item__delete" @click="deleteGroup(index)">X</div>
        <div>分组名称<el-input v-model.lazy="item.groupName" maxlength="6" show-word-limit /></div>
        <div>
          商品展示样式
          <el-radio-group v-model.lazy="item.comType" class="ml-4">
            <el-radio label="list" size="large">单列</el-radio>
            <el-radio label="column" size="large">双列</el-radio>
          </el-radio-group>
        </div>
        <GoodSortSelect hint="最小限2个商品，最大限50个商品" />
      </el-card>
    </div>
    <div class="goods-selector__add-group">
      <div>
        <el-button type="primary" @click="addGroup">添加分组+</el-button>
      </div>
      <div>最少添加三个分组</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, reactive, watch } from "vue";
import fieldProps from "../../utils/fieldProps";
import { useAddField } from "../../utils/useAddField";
import { cloneDeep } from "lodash-es";
import GoodSortSelect from "./components/GoodSortSelector.vue";
import { MGroupGoodCom } from "../../../../bwComponentType";

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
      groupNameUnPicked: "",
      groupNamePicked: "",
      groupBgUnPicked: "",
      groupBgPicked: "",
      groupGoodCom: [],
    },
    cloneDeep(props.model[props.name])
  )
) as MGroupGoodCom;

const addGroup = () => {
  res.groupGoodCom.push({ groupName: "测试分组", comType: "list", compId: "1" });
};
const deleteGroup = (index: number) => {
  res.groupGoodCom.splice(index, 1);
};

watch(res, (value) => {
  emit("change", value);
});
</script>

<script lang="ts">
export default {
  name: "m-fields-goods-group-selector",
};
</script>
