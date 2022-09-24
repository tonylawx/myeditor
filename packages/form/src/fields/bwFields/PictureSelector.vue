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
    <el-form label-position="left" :label-width="120" >
      <el-form-item label="请选择样式" :rules="[{ required: true, message: 'Please input Activity name', trigger: 'blur' }]">
        <el-radio-group v-model="res.imgComItem.comType" size="small">
          <el-row>
            <el-radio-button label="swiper" >轮播</el-radio-button>
            <el-radio-button label="single" >单图</el-radio-button>
            <el-radio-button label="columnTwo" >双列</el-radio-button>
            <el-radio-button label="columnThree" >三列</el-radio-button>
          </el-row>
            <el-row>
              <el-radio-button label="columnFour" >四列</el-radio-button>
              <el-radio-button label="gridFour" >四宫格</el-radio-button>
              <el-radio-button label="gridFive" >五宫格</el-radio-button>
              <el-radio-button label="gridTian" >田字格</el-radio-button>
            </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择样式" :rules="[{ required: true, message: 'Please input Activity name', trigger: 'blur' }]">
        <el-radio-group v-model="res.imgComItem.swiperOptions.auto" size="small">
          <el-radio label="true" >自动</el-radio>
          <el-radio label="false" >手动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自动轮播间隔" >
        <el-input type="number" v-model.lazy="res.imgComItem.swiperOptions.duration">
          <template #append>毫秒</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="picture-selector__groups">
      <el-card v-for="(item,index) in res.imgList" class="picture-selector__groups__item">
        <div class="picture-selector__groups__item__delete" @click="deleteGroup(index)">X</div>
        <el-form>
          <el-form-item  label="选择图片">
            <UploadCustom :showCropper="false"  text="上传图片" :limit="1" urlModel v-model:url="item.url"/>
          </el-form-item>
          <el-form-item label="跳转链接">
            <LinkSelector v-model:link-option="item.link"/>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="picture-selector__add-group">
        <el-button class="picture-selector__add-group__button" type="primary" @click="addGroup">添加+</el-button>
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
import { defineProps,  reactive, ref,watch} from 'vue';
import { ElTable } from 'element-plus';
import { findIndex } from 'lodash-es';
import fieldProps from '../../utils/fieldProps';
import { useAddField } from '../../utils/useAddField';
import {cloneDeep} from "lodash-es";
import {MImgCom} from "../../../../bwComponentType";
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
  imgComItem:{
    comType:'',
    swiperOptions:{
      auto:'',
      duration:0
    }
  },
  imgList:[
    {
      url: '',
      height: 0,
      width: 0,
      link: {
        type:'',
        url:''
      }
    }
  ]
},cloneDeep(props.model[props.name]))) as MImgCom
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
const addGroup = () => {
  if(res.imgList.length===6){
    return ElMessage.warning('图片最多只能6张')
  }
  res.imgList.push( {
    url: '',
    height: 0,
    width: 0,
    link: {
      type:'',
      url:''
    }
  });
};
const deleteGroup = (index: number) => {
  res.imgList.splice(index, 1);
};
const openGoodsModal = (index: number) => {
  dialogVisible.value = true;
  currentGroupIndex = index;
};
const handleModalConfirm = () => {
  dialogVisible.value = false;
  res.imgList[currentGroupIndex] = multipleTableRef.value!.getSelectionRows();
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
  name: 'm-fields-picture-selector',
};
</script>
