## UploadCustom

Demo:

```vue
<template>
  <div>
    <upload-custom
      v-model:fileList="fileList"
      filePath="hotelArea/test/cover"
    ></upload-custom>
    <a-button type="normal" v-if="true" @click="showProps">
      显示fileList数据
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import UploadCustom from '@/components/upload-custom/upload-custom.vue'
import { reactive } from 'vue'

const fileList: any = reactive([])
const showProps = () => {
  console.log(fileList, 'props++++')
}
</script>
```

### API

| 参数         | 说明                 | 类型                  | 默认值                              |
| ------------ | -------------------- | --------------------- | ----------------------------------- |
| filePath     | 上传 oss 的目录路径  | string                | ''                                  |
| env          | 上传 oss 的环境      | string                | test ｜ dev ｜ pre ｜ prod ｜ false |
| dsn          | oss 转换域名         | string                | img.betterwood.com                  |
| minWidth     | 上传图片最小宽度     | number                | 120                                 |
| minHeight    | 上传图片最小高度     | number                | 0                                   |
| limit        | 限制上传的数量       | number                | 9999                                |
| sizeLimit    | 限制上传的大小       | number                | 5                                   |
| convertType  | 上传时转换图片的类型 | string                | jpg                                 |
| ossConfig    | 上传时展示裁剪弹窗   | 参数见下 ossConfig    | -                                   |
| cropperProps | 上传时展示裁剪弹窗   | 参数见下 cropperProps | -                                   |

更多参数请查看[antd upload](https://www.antdv.com/components/upload-cn)

### ossConfig

| 参数            | 说明            | 类型    | 默认值          |
| --------------- | --------------- | ------- | --------------- |
| secure          | oss 协议类型    | boolean | true            |
| region          | oss 地区        | string  | oss-cn-shenzhen |
| accessKeyId     | oss 登录账号    | string  | ''              |
| accessKeySecret | oss 登录 secret | string  | ''              |

### cropperProps

| 参数               | 说明                   | 类型    | 默认值 |
| ------------------ | ---------------------- | ------- | ------ |
| initialAspectRatio | 初始化裁剪比           | number  | 1 / 1  |
| aspectRatio        | 裁剪比                 | number  | -      |
| viewMode           | cropper 的视图模式     | number  | 1      |
| movable            | 是否允许移动图片       | boolean | true   |
| zoomable           | 是否允许放大图像       | boolean | true   |
| center             | 初始裁剪框居中         | boolean | false  |
| rotatable          | 是否旋转               | boolean | false  |
| autoCropArea       | 定义自动剪裁区域的大小 | number  | 1      |
| dragMode           | 拖动模式               | string  | move   |

更多参数请查看[cropperjs](https://www.npmjs.com/package/vue-cropper)
