<template>
  <div class="good-sort-selector">
    <div class="good-sort-selector__draggable-goods">
      <draggable
        v-model.lazy="goods"
        group="people"
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
      <el-link type="primary" @click="openGoodsModal">添加法宝</el-link
      ><el-link>刷新组件数据</el-link>拖动可调节顺序
    </div>
    <div class="good-sort-selector__hint">{{ hint }}</div>
    <el-dialog v-model="dialogVisible" title="法宝" >
      <el-form lable-postion="left" >
        <el-form-item label="选择法宝">
          <el-select v-model="treasureId">
            <el-option v-for="(item,index) in tableData" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="领取次数">
          <el-input type="number"/>
        </el-form-item>
      </el-form>
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
import { defineProps, ref } from 'vue';
import draggable from 'vuedraggable';
import { find, findIndex } from 'lodash-es';

const goods = ref([]);
const treasureId = ref('');
const tableData = [
  {
    name: '法宝1',
    price: '100',
    merchant: '商家1',
    type: '分类1',
    id: '1',
  },
  {
    name: '法宝2',
    price: '50',
    merchant: '商家2',
    type: '分类2',
    id: '2',
  },
];
const dialogVisible = ref(false);
defineProps({
  hint: {
    type: String,
    default: () => '',
  },
});

const openGoodsModal = () => {
  dialogVisible.value = true;
  treasureId.value = '';
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  const item = find(tableData, { id: treasureId.value });
  goods.value.push(item as never);
};
const deleteGood = (good: any, goods: any) => {
  const index = findIndex(goods, good);
  goods.splice(index, 1);
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
