<template>
  <div class="good-sort-selector">
    <div class="good-sort-selector__draggable-goods">
      <draggable v-model.lazy="goods" group="people" item-key="id">
        <template #item="{ element }">
          <div class="good-sort-selector__draggable-goods__item">
            <el-tooltip :content="element.magicName" trigger="click">
              <div class="good-sort-selector__draggable-goods__item__title">
                {{ element.magicName }}
              </div>
            </el-tooltip>
            {{ element.times }}
            <el-link @click="deleteGood(element, goods)">删除</el-link>
          </div>
        </template>
      </draggable>
    </div>
    <div class="good-sort-selector__add-good">
      <el-link type="primary" @click="openGoodsModal">添加法宝</el-link
      ><el-link @click="handleUpdate">刷新组件数据</el-link>拖动可调节顺序
    </div>
    <div class="good-sort-selector__hint">{{ hint }}</div>
    <el-dialog v-model="dialogVisible" title="法宝" width="500">
      <el-form lable-postion="left">
        <el-form-item label="选择法宝" :rules="[{ required: true }]">
          <el-select v-model="treasureId">
            <el-option
              v-for="item in options"
              :key="item.id"
              :value="item.id"
              :label="item.magicName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          style="margin-top: 10px"
          label="领取次数"
          min="1"
          :rules="[{ required: true }]"
        >
          <el-input type="number" v-model="times" />
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
import { defineEmits, defineProps, ref } from 'vue';
import draggable from 'vuedraggable';
import { find, findIndex } from 'lodash-es';
import short from 'short-uuid';

import {
  ITreasureItem,
  queryTreasureList,
  updatePage,
} from '../../../../../../playground/src/services/editor';

const goods = ref<ITreasureItem[]>([]);
const treasureId = ref<string>('');
const times = ref<string>('');
const options = ref<ITreasureItem[]>([]);
const dialogVisible = ref(false);
const getTreasureList = async () => {
  options.value = await queryTreasureList();
};
getTreasureList();
defineProps({
  hint: {
    type: String,
    default: () => '',
  },
  compId: {
    type: String,
    default: () => '',
  },
});
const emits = defineEmits(['update:compId']);

const openGoodsModal = () => {
  dialogVisible.value = true;
  treasureId.value = '';
  times.value = '1';
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  const id = treasureId.value;
  const item = find(options.value, { id }) as ITreasureItem;
  item.times = times.value;
  goods.value.push(item);
};
const deleteGood = (good: any, goods: any) => {
  const index = findIndex(goods, good);
  goods.splice(index, 1);
};
const handleUpdate = () => {
  const pageId = JSON.parse(localStorage.getItem('pageId') || '');
  const comsId = new Date().getTime();
  const tmp = {
    id: pageId,
    components: [
      {
        components: goods.value.map(item => ({
          paramValue: item.times,
          paramId: item.id,
          componentType: '3'
        })),
        comsId,
      },
    ],
  };
  updatePage(tmp).then(() => {
    emits('update:compId', comsId);
  });
};
</script>

<style scoped lang="scss">
.good-sort-selector {
  &__draggable-goods {
    width: 300px;

    &__item {
      display: flex;
      justify-content: space-around;
      &__title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
      }
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
