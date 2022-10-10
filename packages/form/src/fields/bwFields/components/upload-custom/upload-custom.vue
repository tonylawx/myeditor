<template>
  <Upload
    :file-list="fileList"
    name="file"
    :accept="accept"
    :list-type="listType"
    :before-upload="beforeUpload"
    :custom-request="handleCustomUpload"
    @preview="handlePreview"
    :remove="handleRemove"
    :disabled="!props.openFileDialogOnClick || loading"
    v-if="props.urlModel"
  >
    <div v-if="listType === 'text'">
      <el-button type="primary" :disabled="props.fileList.length >= limit || loading">
        <loading-outlined v-if="loading"></loading-outlined>
        <upload-outlined v-else></upload-outlined>
        {{ loading ? "正在上传" : "上传视频" }}
      </el-button>
    </div>
    <div v-else>
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </div>
  </Upload>
  <Upload
    :file-list="props.fileList"
    name="file"
    :accept="accept"
    :list-type="listType"
    :before-upload="beforeUpload"
    :custom-request="handleCustomUpload"
    @preview="handlePreview"
    :remove="handleRemove"
    :disabled="!props.openFileDialogOnClick || loading"
    v-else
  >
    <div v-if="listType === 'text'">
      <el-button type="primary" :disabled="props.fileList.length >= limit || loading">
        <loading-outlined v-if="loading"></loading-outlined>
        <upload-outlined v-else></upload-outlined>
        {{ loading ? "正在上传" : "上传视频" }}
      </el-button>
    </div>
    <div v-else>
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </div>
  </Upload>
  <el-dialog
    title="请选择剪裁区域"
    v-model="cropperVisible"
    :maskClosable="false"
    :width="modalWidth"
    @cancel="handleCloseCropper"
  >
    {{ props?.minWidth }}{{ props?.minHeight }}
    <template #footer>
      <el-button key="submit" type="primary" :loading="loading" @click="handleCropper">
        确定
      </el-button>
      <el-button type="normal" key="back" @click="handleCloseCropper"> 取消 </el-button>
    </template>
    <!-- :outputType="props.cropperProps.type" -->
    <VueCropper
      class="cropper-wrap"
      :style="{ height: '400px', width: '100%' }"
      ref="cropperRef"
      :img="imageInfo.src"
      :outputSize="props.cropperProps.size"
      :outputType="props.cropperProps.type"
      :autoCropWidth="props?.minWidth"
      :autoCropHeight="props?.minHeight"
      :fixedNumber="
        props?.minWidth && props?.minHeight ? [props?.minWidth, props?.minHeight] : [1, 1]
      "
      :info="true"
      :canScale="true"
      :autoCrop="true"
      :fixed="!!(props?.minWidth && props?.minHeight) || false"
      :full="true"
      :fixedBox="false"
      :canMove="true"
      :canMoveBox="true"
      :original="cropperProps.original || false"
      :centerBox="true"
      :high="true"
      :infoTrue="true"
      :maxImgSize="3000"
      :enlarge="1"
      mode="contain"
    ></VueCropper>
  </el-dialog>
  <el-button type="normal" v-if="false" @click="showProps"> 显示props数据 </el-button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import { VueCropper } from 'vue-cropper';
import { Upload } from 'ant-design-vue';
import { FileType } from 'ant-design-vue/es/upload/interface';
import { ElMessage as message } from 'element-plus';
import mimeTypes from 'mime-types';
import short from 'short-uuid';

import 'ant-design-vue/es/upload/style/css';

import { delFromOss, uploadToOss } from '../../utils/oss';

import { getImageData, handlePreview } from './utils';

const { VITE_ENV = 'dev' } = import.meta.env;
const $emit = defineEmits(['successCallback', 'update:fileList', 'update:url']);

const props = withDefaults(
  defineProps<{
    env?: string;
    filePath: string;
    ossConfig?: any;
    dsn?: string;
    minWidth?: number;
    minHeight?: number;
    delSyncOss?: boolean;
    convertType?: string;
    limit?: number;
    sizeLimit?: number;
    showCropper?: boolean;
    cropperProps?: any;
    fileList: any;
    listType?: 'text' | 'picture' | 'picture-card';
    text?: string;
    openFileDialogOnClick?: boolean;
    accept?: string;
    urlModel: boolean;
    url?: string;
  }>(),
  {
    env: VITE_ENV, // 上传oss的环境 'test' | 'dev' | 'uat' | 'prod'
    filePath: '', // 图片上传的路径
    ossConfig: {} as any, // ossConfig配置
    dsn: 'img.betterwood.com',
    minWidth: 120, // 图片的最小宽度限制
    minHeight: 0, // 图片的最小高度限制
    delSyncOss: false, // 同步删除图片标识，若为true，点击删除，则不受业务控制，会直接删除oss上的图片
    convertType: '',
    limit: 9999, // 图片上传张数限制
    sizeLimit: 5, // 图片的体积大小限制
    showCropper: true, // 上传图片是是否需要截图标识
    // 截图工具的参数对象
    cropperProps: {
      // 裁剪生成图片的质量，这里文档定义是数字，但是用数字，上传图片后体积会比较大，用字符串上传，控制台会警告类型，但是大小会和源图片大小一致
      size: 1,
    },
    fileList: [], // 已上传图片的地址数组
    listType: 'picture-card', // upload组件显示的样式
    text: 'Upload', // 上传按钮文字
    openFileDialogOnClick: true,
    accept: 'image/png, image/jpeg',
    urlModel: false,
  },
);
console.log('upload|props|env', props.env);
// 上传中标识
const loading = ref<boolean>(false);
// 截图图片的地址
const imageUrl = ref<string>('');
// 截图器是否显示控制标识
const cropperVisible = ref<boolean>(false);
// 截图框显示宽度
const modalWidth = ref<number>(820);
const cropperRef = ref();
const fileList = ref<any>([]);

let timer: any = null;
let blobFile: any = null;
let cutWidth = 0; // 裁剪后的宽度
let cutHeight = 0; // 裁剪后的高度
// 上传的图片信息
const imageInfo = ref<{
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  filename: string;
  size: number;
  type: string;
  uid: string;
  width?: number;
  height?: number;
}>({} as any);
const showProps = () => {
  console.log(props, 'props++++');
};
/**
 * @method
 * @desc 文件上传前处理方法
 */
const beforeUpload = async (file: FileType): Promise<FileType | boolean> => {
  const { minWidth, minHeight, limit, sizeLimit, showCropper } = props;
  console.log('file ---------->', file);

  return new Promise(async (resolve, reject) => {
    const isLen = limit ? (props.urlModel ? fileList.value : props.fileList).length < limit : true;
    if (!isLen) {
      message.error(`超过最大上传数量${limit}张，请重新选择！`);
      reject();
      return false;
    }
    // 限制上传图片的大小
    const isSizeLimit = sizeLimit ? file.size / 1024 / 1024 <= sizeLimit : true;
    if (!isSizeLimit) {
      message.error(`超过大小限制${sizeLimit}M，请重新选择！`);
      reject();
      return false;
    }

    // if (file.type.indexOf('image') === -1) {
    //   resolve()
    //   return true
    // }

    const { naturalWidth, naturalHeight, src } = await getImageData(file);

    // 限制上传图片的宽高
    if (minWidth && minWidth > naturalWidth) {
      message.error(`图片最小宽度${minWidth}，请重新选择！`);
      reject();
      return false;
    }
    if (minHeight && minHeight > naturalHeight) {
      message.error(`图片最小高度${minHeight}，请重新选择！`);
      reject();
      // eslint-disable-next-line no-promise-executor-return
      return false;
    }
    const newImageInfo = {
      src,
      naturalWidth: +parseInt(`${naturalWidth}`, 10),
      naturalHeight: +parseInt(`${naturalHeight}`, 10),
      filename: file.name,
      size: file.size / 1024 / 1024,
      type: file.type.split('/')[1],
      uid: file.uid,
      width: showCropper ? 0 : naturalWidth,
      height: showCropper ? 0 : naturalHeight,
    };
    props.cropperProps.type = newImageInfo.type;
    console.log('newImageInfo ---------->', newImageInfo);
    if (showCropper) {
      cropperVisible.value = true;
      // 设置cropper属性
      imageInfo.value = newImageInfo;
      modalWidth.value = naturalWidth < naturalHeight ? 520 : 820;
      timer = setInterval(() => {
        console.log('定时器还没清~~~');
        if (blobFile) {
          blobFile.uid = file.uid;
          blobFile.name = file.name;

          imageInfo.value.width = cutWidth || 0;
          imageInfo.value.height = cutHeight || 0;
          console.log(blobFile, 'blobFile~~~~~~~~~~~~~~~');
          resolve(blobFile);

          // 清空
          blobFile = null;
          handleCloseCropper();
        }
      }, 100);
    } else {
      imageInfo.value = newImageInfo;
      resolve(true);
    }
  });
};

/**
 * @method
 * @desc 图片自定义上传方法
 */
const handleCustomUpload = async (options: any) => {
  console.log(options, 'options~~~~~~~~');
  loading.value = true;
  const { onSuccess, file } = options;
  const { width, height } = imageInfo.value;
  // const { type, name } = file
  const { type } = file;
  const { env, filePath, ossConfig, dsn, convertType } = props;
  const otherType = mimeTypes.extension(type);
  const imageType = convertType || type.split('/')[1];
  // const typeLen = name.split('.')
  // const imageType = convertType || typeLen[typeLen.length - 1]

  // 组装上传路径
  const path =    type.indexOf('image') !== -1
    ? `/sys/${filePath}-${short.generate()}-${width}-${height}.${imageType}`
    : `/sys/${filePath}-${short.generate()}.${otherType}`;
  uploadToOss({ ...ossConfig, env }, file, path)
    .then((res: any) => {
      // 图片上传成功后，这里处理url
      // res对象中的url类似：https://test-bdw.oss-cn-shenzhen.aliyuncs.com/sys...，访问会直接下载
      // 需要将url改成：https://test.img.betterwood.com/sys...
      // if (props.fileList.length) {
      //   props.fileList = props.fileList.map((v) => {
      //     // console.log(99999999)
      //     if (v.uid === file.uid) {
      //       return {
      //         uid: file.uid,
      //         name: file.name,
      //         status: 'done',
      //         url: convertDsnUrl(env, dsn, res.url),
      //         width,
      //         height,
      //       }
      //     }
      //     return v
      //   })
      // } else {
      // props.fileList.push({
      //   uid: res.uid,
      //   name: res.name,
      //   status: 'done',
      //   url: convertDsnUrl(env, dsn, res.url),
      //   width,
      //   height,
      // })
      // }
      onSuccess(res, file);
      options.status = 'done';
      const url = convertDsnUrl(env, dsn, res.url);
      if (props.urlModel) {
        $emit('update:url', url);
        fileList.value.push({
          uid: res.uid,
          name: props.listType === 'text' ? res.url : res.name,
          status: 'done',
          url,
          width,
          height,
        });
      } else {
        props.fileList.push({
          uid: res.uid,
          name: props.listType === 'text' ? res.url : res.name,
          status: 'done',
          url,
          width,
          height,
        });
      }
      console.log('res   ------->1111', res, env, props.fileList, file, options);
      // $emit('update:fileList', props.fileList)
    })
    .catch((e) => {
      console.warn('[handleCustomUpload]', e);
      message.warning('上传失败，请重新上传');
    })
    .finally(() => {
      loading.value = false;
    });
};

// 移除文件
const handleRemove = (file: any) => {
  const removeCb = () => {
    const index = (props.urlModel ? fileList.value : props.fileList).findIndex((v: any) => v.url === file.url);
    if (props.urlModel) {
      fileList.value.splice(index, 1);
      $emit('update:url', '');
    }
    props.fileList.splice(index, 1);
    $emit('update:fileList', props.fileList);
  };
  // 同步删除的接口还有问题，暂时只能做表面删除
  if (props.delSyncOss) {
    const reg = file.url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    delFromOss(props.ossConfig, reg[5])
      .then(() => {
        message.error('删除成功');
        removeCb();
      })
      .catch(() => {
        message.error('删除失败');
      });
  } else {
    removeCb();
  }
};

const reg = /(?:http(?:s|):\/\/[^/\s]+|)([^#?]+).*/;
const convertDsnUrl = (env: string, dsn: string, url: string): string => {
  if (!url) return '';
  if (!dsn) return url;

  const path = url.match(reg)?.[1];
  if (env === 'prod') return `https://${dsn}${path}`;
  if (env === 'uat') return `https://uat.${dsn}${path}`;
  return `https://test.${dsn}${path}`;
};

/**
 * @method
 * @desc 关闭截图器，清除定时器
 */
const handleCloseCropper = () => {
  cropperVisible.value = false;
  window.clearInterval(timer);
};

/**
 * @method
 * @desc 开始截图
 */
const handleCropper = async () => {
  cropperRef.value.getCropBlob(async (res: any) => {
    console.log(cropperRef.value.cropInfo, 'this.$refs.cropper.cropW~~~~~~');
    cutWidth = cropperRef.value.cropInfo.width;
    cutHeight = cropperRef.value.cropInfo.height;
    blobFile = res;
    cropperVisible.value = false;
  });
};
</script>
