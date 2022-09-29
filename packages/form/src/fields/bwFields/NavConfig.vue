<style scoped lang="scss">
.picture-selector{
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
  &__add-group{
    margin-top: 10px;
    &__button{
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="picture-selector" >
    <el-form>
      <el-form-item label="样式" :rules="[{ required: true }]">
            app导航
      </el-form-item>
    </el-form>
    <div class="picture-selector__groups">
      <el-card v-for="(item,index) in res.navList" class="picture-selector__groups__item">
        <template #header>
          导航{{index+1}}
          <el-link v-if="item.isDefault">默认导航</el-link>
          <el-link v-else @click="handleSetDefault(index)">设为默认</el-link>
        </template>
        <div class="picture-selector__groups__item__delete" @click="deleteGroup(index)">X</div>
        <el-form>
          <el-form-item  label="未选中icon">
            <UploadCustom :showCropper="false"  text="上传图片" :limit="1" urlModel v-model:url="item.pickedIcon"/>
          </el-form-item>
          <el-form-item  label="选中icon">
            <UploadCustom :showCropper="false"  text="上传图片" :limit="1" urlModel v-model:url="item.unPickedIcon"/>
          </el-form-item>
          <el-form-item label="导航链接">
            <LinkSelector v-model:link-option="item.link"/>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="picture-selector__add-group">
      <el-button class="picture-selector__add-group__button" type="primary" @click="addGroup">添加一个导航</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps,  reactive, ref,watch} from 'vue';
import { ElTable } from 'element-plus';
import { findIndex } from 'lodash-es';
import fieldProps from '../../utils/fieldProps';
import { useAddField } from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import { MNavCom} from "./bwComponentType";
import { ElMessage } from 'element-plus'
import { UploadCustom } from './components/upload-custom'
import LinkSelector from "./components/LinkSelector.vue";
const fileList = ref([])
const props = defineProps({
  ...fieldProps,
  config:{
    type:Object,
    default:()=>{}
  }
});

useAddField(props.prop);
const emit = defineEmits(['change'])

const res = reactive(Object.assign({},{
  navList:[]
},cloneDeep(props.model[props.name]))) as MNavCom
// table实例
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 对话框flag
const dialogVisible = ref(false);
// 当前分组index
let currentGroupIndex = NaN;
const addGroup = () => {
  if(res.navList.length===5){
    return ElMessage.warning('不能再添加了，最多添加5个导航')
  }
  res.navList.push( {
    isDefault: false,
    pickedIcon: '',
    unPickedIcon: '',
    link: {
      type:'H5',
      url:''
    }
  });
  if(res.navList.length===1){
    res.navList[0].isDefault=true
  }
};
const deleteGroup = (index: number) => {
  res.navList.splice(index, 1);
};
const openGoodsModal = (index: number) => {
  dialogVisible.value = true;
  currentGroupIndex = index;
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  res.navList[currentGroupIndex] = multipleTableRef.value!.getSelectionRows();
};
const deleteGood = (good:any, goods: any) => {
  const index = findIndex(goods, good);
  goods.splice(index, 1);
};
const handleSetDefault = (index:number)=>{
  if(res.navList.length>1){
    res.navList.forEach(item=>{
      item.isDefault = false
    })
    res.navList[index].isDefault=true
  }
}
watch(res, (value) => {
  emit('change',value)
})
</script>

<script lang="ts">
export default {
  name: 'm-fields-nav-config',
};
</script>
