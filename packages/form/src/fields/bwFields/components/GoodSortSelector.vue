<template>
  <div class="good-sort-selector">
    <div class="good-sort-selector__draggable-goods">
      <draggable
        v-model.lazy="goods"
        group="people"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="good-sort-selector__draggable-goods__item">
            <div>{{ element.name }}</div>
            <el-link @click="deleteGood(element, goods)">删除</el-link>
          </div>
        </template>
      </draggable>
    </div>
    <div class="good-sort-selector__add-good">
      <el-link type="primary" @click="openGoodsModal(index)">添加商品</el-link
      ><el-link>刷新组件数据</el-link>拖动可调节顺序
    </div>
    <div class="good-sort-selector__hint">{{ hint }}</div>
    <el-dialog v-model="dialogVisible" title="选择商品" width="80%">
      <el-form lable-postion="left" inline>
        <el-form-item label="商品名称">
          <el-input type="text" />
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
      <el-table
        style="width: 60%; margin-top: 10px"
        :data="tableData"
        border
        ref="multipleTableRef"
      >
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
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
// 对话框flag
import { ref } from "vue";
import { findIndex } from "lodash-es";
import draggable from "vuedraggable";
import { ElTable } from "element-plus";
const goods = ref([]);
const tableData = [
  {
    name: "测试商品1",
    price: "100",
    merchant: "商家1",
    type: "分类1",
    id: "1",
  },
  {
    name: "测试商品2",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "2",
  },
  {
    name: "测试商品3",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "3",
  },
  {
    name: "测试商品4",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "4",
  },
  {
    name: "测试商品5",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "5",
  },
  {
    name: "测试商品6",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "6",
  },
  {
    name: "测试商品7",
    price: "101",
    merchant: "商家2",
    type: "分类2",
    id: "7",
  },
];
const dialogVisible = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
defineProps({
  hint: {
    type: String,
    default: () => "",
  },
});

const openGoodsModal = (index: number) => {
  dialogVisible.value = true;
  setTimeout(() => {
    multipleTableRef.value!.clearSelection();
    goods.value.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, true);
    });
  });
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  goods.value = multipleTableRef.value!.getSelectionRows();
};
const deleteGood = (good, goods: any) => {
  const index = findIndex(goods, good);
  goods.splice(index, 1);
};
</script>
<script lang="ts">
export default {
  name: "GoodSortSelector",
};
</script>

<style scoped lang="scss">
.good-sort-selector {
  &__draggable-goods {
    &__item {
      display: flex;
      justify-content: space-around;
    }
  }
  &__add-good {
    display: flex;
    justify-content: space-around;
  }
  &__hint {
    font-size: 12px;
  }
}
</style>
