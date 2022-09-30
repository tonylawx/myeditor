<template>
  <div class="good-sort-selector">
    <div class="good-sort-selector__draggable-goods">
      <div class="good-sort-selector__draggable-goods__item">
        <div class="good-sort-selector__draggable-goods__item__title">商品名称</div>
        <div>操作</div>
      </div>
      <Daggable v-model.lazy="goods" group="people" item-key="id">
        <template #item="{ element }">
          <div class="good-sort-selector__draggable-goods__item">
            <div class="good-sort-selector__draggable-goods__item__title">
              {{ element.goodsName }}
            </div>
            <el-link @click="deleteGood(element, goods)">删除</el-link>
          </div>
        </template>
      </Daggable>
    </div>
    <div class="good-sort-selector__add-good">
      <el-link type="primary" @click="openGoodsModal">添加商品</el-link
      ><el-link @click="handleUpdate">刷新组件数据</el-link>拖动可调节顺序
    </div>
    <div class="good-sort-selector__hint">{{ hint }}</div>
    <el-dialog v-model="dialogVisible" title="选择商品" width="80%" center>
      <el-form lable-postion="left" inline>
        <el-form-item label="商品名称">
          <el-input type="text" v-model="searchParams.goodsName" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchParams.goodsRelateId"
                     filterable
                     clearable
          >
            <el-option v-for="item in option"
                       :value="item.goodsGroupId"
                       :key="item.goodsGroupId"
                       :label="item.goodsGroupName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getTableData">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        style="margin-top: 10px"
        :data="tableData"
        border
        ref="multipleTableRef"
        height="400"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="showPrice" label="价格" />
        <el-table-column prop="shopName" label="所属商家" />
        <el-table-column prop="oneGoodsRelateName" label="所属分类" />
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        v-model:current-page="searchParams.current"
        v-model:page-size="searchParams.size"
        :total="total"
      />
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
import { defineEmits, defineProps, nextTick, reactive, ref, watch } from 'vue';
import Daggable from 'vuedraggable';
import { ElMessage, ElTable } from 'element-plus';
// 对话框flag
import { cloneDeep, findIndex, uniqBy } from 'lodash-es';

import {
  Data,
  getGoodGroupList,
  getGoodList,
  IGoodsItem,
  updatePage,
} from '../../../../../../playground/src/services/editor';

const goods = ref<IGoodsItem[]>([]);
const tableData = ref<IGoodsItem[]>([]);
const dialogVisible = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const total = ref<number>(0);
const loading = ref<boolean>(false);
const option = ref([]);
class SearchParams {
  current: number;
  size: number;
  goodsName: string | null;
  goodsRelateId: string | null;
  constructor() {
    this.goodsName = null;
    this.goodsRelateId = null;
    this.size = 20;
    this.current = 1;
  }
}
let searchParams = reactive(new SearchParams());
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
const getTableData = () => {
  loading.value = true;
  getGoodList(searchParams)
    .then((res: Data) => {
      tableData.value = res.records;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const getOptions = () => {
  getGoodGroupList().then((res) => {
    option.value = res.records;
  });
};
const openGoodsModal = () => {
  getOptions();
  getTableData();
  dialogVisible.value = true;
  nextTick(() => {
    multipleTableRef.value!.clearSelection();
    goods.value.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, true);
    });
  });
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  const result = uniqBy(
    [...cloneDeep(goods.value), ...(multipleTableRef.value!.getSelectionRows() as IGoodsItem[])],
    'goodsId',
  );
  if (result.length > 20) return ElMessage.warning('最多不能超过20个');
  goods.value = result;
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
          paramId: item.goodsId,
          componentType: '1',
        })),
        comsId,
      },
    ],
  };
  updatePage(tmp).then(() => {
    emits('update:compId', comsId);
  });
};
const reset = () => {
  searchParams = reactive(new SearchParams());
  getTableData();
};
watch(
  () => searchParams.current,
  () => {
    getTableData();
  },
);
</script>
<style scoped lang="scss">
.good-sort-selector {
  &__draggable-goods {
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
