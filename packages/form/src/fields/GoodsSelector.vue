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
      &__add-good {
        display: flex;
        justify-content: space-around;
      }
    }
    &__draggable-goods {
      &__item {
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
<template>
  <div class="goods-selector">
    <el-form label-position="left" :label-width="120">
      <el-form-item label="分组名称未选中颜色">
        <el-color-picker v-model.lazy="res.groupNameUnpicked" />
        {{ res.groupNameUnpicked }}
      </el-form-item>
      <el-form-item label="分组名称选中颜色">
        <el-color-picker v-model.lazy="res.groupNamePicked" />
        {{ res.groupNamePicked }}
      </el-form-item>
      <el-form-item label="分组底色未选中颜色">
        <el-color-picker v-model.lazy="res.groupBgUnpicked" />
        {{ res.groupBgUnpicked }}
      </el-form-item>
      <el-form-item label="分组底色选中颜色">
        <el-color-picker v-model.lazy="res.groupBgPicked" />
        {{ res.groupBgPicked }}
      </el-form-item>
    </el-form>
    <div class="goods-selector__groups">
      <el-card v-for="(item, index) in res.groups" :key="index" class="goods-selector__groups__item">
        <div class="goods-selector__groups__item__delete" @click="deleteGroup(index)">X</div>
        <div>分组名称<el-input v-model.lazy="item.name" maxlength="6" show-word-limit /></div>
        <div>
          商品展示样式
          <el-radio-group v-model.lazy="item.groupStyle" class="ml-4">
            <el-radio label="single" size="large">单列</el-radio>
            <el-radio label="double" size="large">双列</el-radio>
          </el-radio-group>
        </div>
        <div class="goods-selector__groups__draggable-goods">
          <draggable v-model.lazy="item.goods" group="people" @start="drag = true" @end="drag = false" item-key="id">
            <template #item="{ element }">
              <div class="goods-selector__groups__draggable-goods__item">
                <div>{{ element.name }}</div>
                <el-link @click="deleteGood(element, item.goods)">删除</el-link>
              </div>
            </template>
          </draggable>
        </div>
        <div class="goods-selector__groups__item__add-good">
          <el-link type="primary" @click="openGoodsModal(index)">添加商品</el-link>拖动可调节顺序
        </div>
      </el-card>
    </div>
    <div class="goods-selector__add-group">
      <div>
        <el-button type="primary" @click="addGroup">添加分组+</el-button>
      </div>
      <div>最少添加三个分组</div>
    </div>
  </div>
  <el-dialog v-model.lazy="dialogVisible" title="选择商品" width="80%">
    <el-form lable-postion="left">
      <el-form-item label="商品名称">
        <input type="text" />
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select>
          <el-option value="1">分类1</el-option>
          <el-option value="2">分类2</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button>搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table style="width: 60%" :data="tableData" border ref="multipleTableRef">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="merchant" label="所属商家" />
      <el-table-column prop="type" label="所属分类" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleModalConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {computed, defineProps, inject, reactive, ref,watch} from 'vue';
import draggable from 'vuedraggable';
import { ElTable } from 'element-plus';
import { findIndex } from 'lodash-es';
import fieldProps from '../utils/fieldProps';
import { useAddField } from '../utils/useAddField';
import {cloneDeep} from "lodash-es";

const props = defineProps({
  ...fieldProps,
  config:{
    type:Object,
    default:()=>{}
  }
});

useAddField(props.prop);
const emit = defineEmits(['change'])
console.log(props)

const res = reactive(cloneDeep(props.model[props.model.type]))
// table实例
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 对话框flag
const dialogVisible = ref(false);
// 当前分组index
let currentGroupIndex = NaN;
const tableData = [
  {
    name: '测试商品1',
    price: '100',
    merchant: '商家1',
    type: '分类1',
    id: '1',
  },
  {
    name: '测试商品2',
    price: '101',
    merchant: '商家2',
    type: '分类2',
    id: '2',
  },
];
// const res = reactive({
//   groupNameUnpicked: '',
//   groupNamePicked: '',
//   groupBgUnpicked: '',
//   groupBgPicked: '',
//   groups: [
//     {
//       name: '测试分组',
//       groupStyle: 'single',
//       goods: [
//         {
//           name: '测试商品1',
//           price: '100',
//           merchant: '商家1',
//           type: '分类1',
//           id: '1',
//         },
//         {
//           name: '测试商品2',
//           price: '101',
//           merchant: '商家2',
//           type: '分类2',
//           id: '2',
//         },
//       ],
//     },
//   ],
// });
const addGroup = () => {
  res.groups.push({ name: '测试分组' });
};
const deleteGroup = (index: number) => {
  res.groups.splice(index, 1);
};
const openGoodsModal = (index: number) => {
  dialogVisible.value = true;
  currentGroupIndex = index;
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  res.groups[currentGroupIndex].goods = multipleTableRef.value!.getSelectionRows();
};
const deleteGood = (good, goods: any) => {
  const index = findIndex(goods, good);
  goods.splice(index, 1);
};
watch(res, (value) => {
  emit('change',value)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-goods-selector',
};
</script>
