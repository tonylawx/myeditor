<template>
  <div>
    <el-dialog v-model="modalVisible">
      <el-tabs v-model="activeName" lazy>
        <el-tab-pane label="商城小程序功能页面" name="miniProgram">商城小程序功能页面</el-tab-pane>
        <el-tab-pane label="商品详情页" name="goodsDetail">商品详情页</el-tab-pane>
        <el-tab-pane label="商品分组" name="goodsGroup">商品分组</el-tab-pane>
        <el-tab-pane label="会场页面" name="hall">会场页面</el-tab-pane>
        <el-tab-pane label="视频号直播" name="live">直播</el-tab-pane>
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
                <el-input v-model="props.linkOption.appId" placeholder="请输入小程序APPID,找前端开发索取" />
              </el-form-item>
              <el-form-item label="小程序页面路径">
                <el-input v-model="props.linkOption.url" placeholder="请输入小程序页面路径,找前端开发索取" />
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
      <div v-if="props.linkOption.url">
        {{ urlName }}
        <el-button @click="handleOpen">修改链接</el-button>
      </div>
      <el-button v-else @click="handleOpen">选择链接</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

import type { LinkOptions } from '../bwComponentType';

const props = defineProps<{
  linkOption: LinkOptions;
}>();
const activeName = ref('customise');
const modalVisible = ref(false);
const urlName = ref('');
const handleOpen = () => {
  modalVisible.value = true;
};
const handleModalConfirm = ()=>{
  modalVisible.value = false
  if(props.linkOption.type==='H5'){
    urlName.value = `自定义链接-h5-${props.linkOption.url}`
  }
}
</script>
<script lang="ts">
export default {
  name:'LinkSelector'
}
</script>

<style scoped></style>
