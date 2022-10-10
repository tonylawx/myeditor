<template>
  <div>
    <el-dialog v-model="modalVisible">
      <el-tabs v-model="activeName" lazy>
        <el-tab-pane label="商城小程序功能页面" name="miniProgram">
          <el-table :data="miniProgramTableData" height="400">
            <el-table-column prop="name" label="页面名称" width="180" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-link link type="primary" size="small" @click="handleModalConfirm(scope.row)">
                  选择链接
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品详情页" name="goodsDetail">
          <el-form lable-postion="left" inline>
            <el-form-item label="商品名称">
              <el-input type="text" v-model="searchParams.goodsName" />
            </el-form-item>
            <el-form-item>
              <el-button @click="getGoodTableData">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            style="margin-top: 10px"
            :data="goodDetailTableData"
            border
            ref="multipleTableRef"
            height="400"
            v-loading="loading"
          >
            <el-table-column prop="goodsName" label="商品名称" />
            <el-table-column prop="showPrice" label="价格" />
            <el-table-column prop="shopName" label="所属商家" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-link link type="primary" size="small" @click="handleModalConfirm(scope.row)">
                  选择链接
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            v-model:current-page="searchParams.current"
            v-model:page-size="searchParams.size"
            :total="total"
          />
        </el-tab-pane>
        <el-tab-pane label="商品分组" name="goodsGroup">
          <el-form lable-postion="left" inline>
            <el-form-item label="商品分组名称">
              <el-input type="text" v-model="searchParams.goodsGroupName" />
            </el-form-item>
            <el-form-item>
              <el-button @click="getGoodGroupTableData">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            style="margin-top: 10px"
            :data="goodGroupTableData"
            border
            ref="multipleTableRef"
            height="400"
            v-loading="loading"
          >
            <el-table-column prop="goodsGroupName" label="商品分组名称" />
            <el-table-column prop="goodsNumber" label="商品数量" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-link link type="primary" size="small" @click="handleModalConfirm(scope.row)">
                  选择链接
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            v-model:current-page="searchParams.current"
            v-model:page-size="searchParams.size"
            :total="total"
          />
        </el-tab-pane>
        <el-tab-pane label="会场页面" name="hall">
          <el-form lable-postion="left" inline>
            <el-form-item label="页面名称">
              <el-input type="text" v-model="searchParams.pageName" />
            </el-form-item>
            <el-form-item>
              <el-button @click="getConferencePageList">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            style="margin-top: 10px"
            :data="confPageListTableData"
            border
            ref="multipleTableRef"
            height="400"
            v-loading="loading"
          >
            <el-table-column prop="pageName" label="页面名称" />
            <el-table-column label="页面状态">
              <template #default="scope">
                <div v-if="scope.row.pageStatus === 0">未发布</div>
                <div v-if="scope.row.pageStatus === 1">未发布</div>
                <div v-if="scope.row.pageStatus === 2">定时发布</div>
                <div v-if="scope.row.pageStatus === 3">已下架</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-link link type="primary" size="small" @click="handleModalConfirm(scope.row)">
                  选择链接
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            v-model:current-page="searchParams.current"
            v-model:page-size="searchParams.size"
            :total="total"
          />
        </el-tab-pane>
        <el-tab-pane label="视频号直播" name="live">
          <el-form-item label="视频 feedId">
            <el-input v-model="props.linkOption.feedId" placeholder="视频 feedId" />
          </el-form-item>
          <el-form-item label="视频号 id">
            <el-input
              v-model="props.linkOption.finderUserName"
              placeholder="视频号 id，以“sph”开头的id，可在视频号助手获取"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="自定义链接" name="customise">
          <el-form>
            <el-form-item>
              <el-radio-group v-model="props.linkOption.type">
                <el-radio label="H5">H5</el-radio>
                <el-radio label="MiniProgram">微信小程序页面</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="props.linkOption.type === 'H5'">
              <el-input
                label="H5地址"
                v-model="props.linkOption.url"
                placeholder="若链接地址为外部合作地址,请先联系管理员将该地址所属域名添加到小程序白名单"
              />
            </el-form-item>
            <div v-if="props.linkOption.type === 'MiniProgram'">
              <el-form-item label="小程序APPID">
                <el-input
                  v-model="props.linkOption.appId"
                  placeholder="请输入小程序APPID,找前端开发索取"
                />
              </el-form-item>
              <el-form-item label="小程序页面路径">
                <el-input
                  v-model="props.linkOption.url"
                  placeholder="请输入小程序页面路径,找前端开发索取"
                />
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="handleModalConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div>
      <div v-if="props.linkOption.url || props.linkOption.type === 'Live'">
        {{ urlName }}
        <el-button @click="handleOpen">修改链接</el-button>
      </div>
      <el-button v-else @click="handleOpen">选择链接</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, reactive, ref, watch} from 'vue';

import {
  Data,
  getAppletLinkList,
  getConfPageList,
  getGoodGroupList,
  getGoodList,
  IGoodsItem,
  IGoodsParams,
} from '../../../../../../playground/src/services/editor';
import type {LinkOptions} from '../bwComponentType';

class SearchParams {
  current: number;
  size: number;
  goodsName: string | null;
  goodsGroupName: null;
  pageName: null;
  constructor() {
    this.goodsName = null;
    this.goodsGroupName = null;
    this.pageName = null;
    this.size = 20;
    this.current = 1;
  }
}
const props = defineProps<{
  linkOption: LinkOptions;
}>();
const activeName = ref('customise');
const modalVisible = ref(false);
const urlName = ref('');
const loading = ref(false);
const miniProgramTableData = ref([]);
const goodDetailTableData = ref<IGoodsItem[]>([]);
const goodGroupTableData = ref<IGoodsItem[]>([]);
const confPageListTableData = ref<IGoodsItem[]>([]);
const searchParams = reactive(new SearchParams());
const total = ref(0);
const emits = defineEmits(['update:linkOption']);
const handleOpen = () => {
  modalVisible.value = true;
};
const getGoodTableData = () => {
  loading.value = true;
  getGoodList(searchParams as Partial<IGoodsParams>)
    .then((res: Data) => {
      goodDetailTableData.value = res.records;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const getGoodGroupTableData = () => {
  loading.value = true;
  getGoodGroupList(searchParams as Partial<IGoodsParams>)
    .then((res: Data) => {
      goodGroupTableData.value = res.records;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const getConferencePageList = () => {
  loading.value = true;
  getConfPageList(searchParams as Partial<IGoodsParams>)
    .then((res: any) => {
      confPageListTableData.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleModalConfirm = (row: any) => {
  modalVisible.value = false;
  if (props.linkOption.type === 'H5') {
    urlName.value = `自定义链接-h5-${props.linkOption.url}`;
  }
  if (activeName.value === 'miniProgram') {
    urlName.value = row.name;
    emits('update:linkOption', {
      type: 'miniProgram',
      url: row.appletPath,
    });
  }
  if (activeName.value === 'goodsDetail') {
    urlName.value = row.goodsName;
    emits('update:linkOption', {
      type: 'miniProgram',
      url: row.goodsPath,
    });
  }
  if (activeName.value === 'goodsGroup') {
    urlName.value = row.goodsGroupName;
    emits('update:linkOption', {
      type: 'miniProgram',
      url: row.goodsGroupPath,
    });
  }
  if (activeName.value === 'hall') {
    urlName.value = row.pageName;
    emits('update:linkOption', {
      type: 'h5',
      url: row.path,
    });
  }
  if (activeName.value === 'live') {
    urlName.value = '直播链接';
  }
};
watch(activeName, (value) => {
  switch (value) {
    case 'miniProgram':
      loading.value = true;
      getAppletLinkList()
        .then((res) => {
          miniProgramTableData.value = res;
        })
        .finally(() => {
          loading.value = false;
        });
      break;
    case 'goodsDetail':
      getGoodTableData();
      break;
    case 'goodsGroup':
      getGoodGroupTableData();
      break;
    case 'hall':
      getConferencePageList();
      break;
    case 'live':
      emits('update:linkOption', {
        type: 'Live',
      });
      break;
  }
});
watch(
  () => searchParams.current,
  () => {
    switch (activeName.value) {
      case 'goodsDetail':
        getGoodTableData();
        break;
      case 'goodsGroup':
        getGoodGroupTableData();
        break;
      case 'hall':
        getConferencePageList();
        break;
    }
  },
);
</script>

<style scoped></style>
