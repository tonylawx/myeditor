<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        :style="{ height: parseInt(height) + 'px', overflowY: 'hidden' }"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * wangeditor - 富文本插件
 * 文档地址:https://www.wangeditor.com/v5/menu-config.html#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87
 */
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { IToolbarConfig, SlateElement } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { customCheckImageFn, customParseImageSrc, handleCustomUpload } from './utils';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

type ImageElement = SlateElement & {
  src: string;
  alt: string;
  url: string;
  href: string;
};

type InsertFnType = (url: string, alt: string, href: string) => void;

interface Props {
  env?: string;
  filePath?: string;
  ossConfig?: any;
  dsn?: string;
  convertType?: string;
  imageSizeLimit?: number;
  maxNumberOfImage?: number;
  htmlValue?: string;
  height?: number | string;
  base64LimitSize?: number;
  videoSizeLimit?: number;
  maxNumberOfVideo?: number;
}

const props = withDefaults(defineProps<Props>(), {
  env: 'dev', // 上传oss的环境 'test' | 'dev' | 'pre' | 'prod' | false
  filePath: 'rich-text/', // 图片上传的路径
  ossConfig: {} as any, // ossConfig配置
  dsn: 'img.betterwood.com',
  convertType: '', // 上传图片类型：jpg、png ...
  imageSizeLimit: 5, // 单个图片的最大体积限制，默认为 5M
  maxNumberOfImage: 100, // 图片最多可上传几个文件，默认为 100
  base64LimitSize: 5, // 图片小于该值就插入base64格式（而不上传），默认为 5kb
  videoSizeLimit: 500, // 单个视频的最大体积限制， 500M
  maxNumberOfVideo: 5, // 视频上传数量
  placeholder: '请输入内容...',
  htmlValue: '', // 富文本内容
  height: 350, // 富文本高度
});

const $emit = defineEmits(['update:htmlValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const valueHtml = ref(props.htmlValue || ''); // 内容 HTML
const mode = ref('default'); // 或 'simple'
// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  // excludeKeys-禁用: group-video 上传视频按钮；insertVideo 插入视频url；
  excludeKeys: [
    // 'group-video',
    // 'insertVideo',
    // 'uploadVideo',
    // 'editVideoSize',
  ],
};

/** 编辑器配置 */
const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {
    editImage: {
      onInsertedImage(imageNode: ImageElement | null) {
        if (imageNode == null) return;

        const { src, alt, url, href } = imageNode;
        console.log('inserted image', src, alt, url, href);
      },
      checkImage: customCheckImageFn, // 也支持 async 函数
      parseImageSrc: customParseImageSrc, // 也支持 async 函数
    },
    uploadImage: {
      server: '/api/upload', // 自动上传接口

      // 小于该值就插入 base64 格式（而不上传），默认为 0,
      base64LimitSize: props.base64LimitSize * 1024, // 5kb

      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: (~~props.imageSizeLimit || 2) * 1024 * 1024,

      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: props.maxNumberOfImage,

      async customUpload(file: File, insertFn: InsertFnType) {
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片 insertFn(url, alt, href)
        handleCustomUpload(file, insertFn, props, String(Date.now()));
      },
    },
    uploadVideo: {
      // 单个文件的最大体积限制，默认为 10M
      maxFileSize: (~props.base64LimitSize || 10) * 1024 * 1024, // 500M

      // 最多可上传几个文件，默认为 5
      maxNumberOfFiles: props.maxNumberOfVideo || 5,

      // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['video/*'],

      // 超时时间，默认为 30 秒
      timeout: 120 * 1000, // 120 秒

      // 自定义插入视频
      async customUpload(file: File, insertFn: InsertFnType) {
        // 同上传图片
        handleCustomUpload(file, insertFn, props, String(Date.now()));
      },
    },
    lineHeight: {
      lineHeightList: ['1', '1.1', '1.15', '1.2', '1.3', '1.4', '1.5', '2', '2.5', '3'],
    },
  },
};

// NOTE:模拟 ajax 异步获取内容
onMounted(() => {});

// NOTE:组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // getAllMenuKeys() 获取toolbar的keys，用来展示或禁用
  console.log('editor.getAllMenuKeys()---->', editor.getAllMenuKeys());
};

const handleChange = (e) => {
  const html = e.getHtml();
  let value = valueHtml.value || '';
  if (!html || html === '<p><br></p>') {
    value = '';
  }
  if (value.indexOf('_blank') >= 0) value = value.replaceAll?.('_blank', '_self');
  // console.log('change------>', e.getHtml(), value)
  $emit('update:htmlValue', value);
};

const setHtml = (html: string) => {
  editorRef.value?.setHtml?.(html);
};

const isEmpty = () => editorRef.value?.isEmpty?.() || false;

const clear = () => {
  editorRef.value?.clear?.();
};

defineExpose({ setHtml, isEmpty, clear });
</script>

<style></style>
