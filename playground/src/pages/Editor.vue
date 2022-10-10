<template>
  <div class="editor-app">
    <m-editor
      v-model="value"
      ref="editor"
      :menu="menu"
      :runtime-url="runtimeUrl"
      :props-configs="propsConfigs"
      :props-values="propsValues"
      :event-method-list="eventMethodList"
      :component-group-list="componentGroupList"
      :default-selected="defaultSelected"
      :moveable-options="moveableOptions"
      :auto-scroll-into-view="true"
      :stage-rect="stageRect"
    >
    </m-editor>

    <el-dialog
      v-model="previewVisible"
      destroy-on-close
      custom-class="pre-viewer"
      title="预览"
      :width="stageRect && stageRect.width"
    >
      <iframe
        v-if="previewVisible"
        width="100%"
        :height="stageRect && stageRect.height"
        :src="previewUrl"
      ></iframe>
    </el-dialog>
    <el-dialog
      v-model="publishTimingDialog"
      title="定时发布"
      width="30%"
      @open="publishTiming = null"
    >
      <el-form>
        <el-form-item label="发布时间">
          <el-date-picker
            type="datetime"
            v-model="publishTiming"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="publishTimingDialog = false">取消</el-button>
          <el-button type="primary" @click="handleDelayPublish">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, toRaw} from 'vue';
// import { useRouter } from 'vue-router';
import {Coin, Connection, Document} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {get} from 'lodash-es';
import serialize from 'serialize-javascript';

import {editorService, MenuBarData, MoveableOptions, TMagicEditor} from '@tmagic/editor';
import type {Id, MContainer, MNode} from '@tmagic/schema';
import {NodeType} from '@tmagic/schema';
import StageCore from '@tmagic/stage';
import {asyncLoadJs} from '@tmagic/utils';

// import DeviceGroup from '../components/DeviceGroup.vue';
import componentGroupList from '../configs/componentGroupList';
import dsl from '../configs/dsl';
import {getDSL, newPage, updatePage, updatePageStatus, uploadOssJSON} from '../services/editor';
import {useMainStore} from '../store/main';
import * as TYPES from '../store/type';

const { VITE_RUNTIME_PATH, VITE_ENTRY_PATH, VITE_PREVIEW_PATH } = import.meta.env;

const runtimeUrl = `${VITE_RUNTIME_PATH}/playground/index.html`;
// const router = useRouter();
const editor = ref<InstanceType<typeof TMagicEditor>>();
const previewVisible = ref(false);
const value = ref(dsl);
const defaultSelected = ref(dsl.items[0]?.id);
const propsValues = ref<Record<string, any>>({});
const propsConfigs = ref<Record<string, any>>({});
const eventMethodList = ref<Record<string, any>>({});
const publishTimingDialog = ref(false);
const publishTiming = ref(null);
const stageRect = ref({
  width: 375,
  height: 817,
});
const store = useMainStore();
// const previewUrl = computed(() => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${editor.value?.editorService.get('page').id}`);
const previewUrl = computed(() => `${VITE_PREVIEW_PATH}?pageId=${store.pageId}&isPreview=1`);
const params = new URLSearchParams(window.location.search);
const status = params.get('status'); // copy edit
let pageId = params.get('pageId') || undefined;
const token = params.get('token') || '';
store.update_token(token);
store[TYPES.UPDATE_PAGE_ID](pageId);

if (pageId) {
  getDSL(pageId).then((res) => {
    const { data } = res;
    console.log(data);
    value.value = data;
  });
} else {
  newPage({
    pageName: `未命名页面${new Date().getTime()}`,
    pageStatus: '0',
    pageUrl: '',
  }).then((res) => {
    pageId = res;
    store[TYPES.UPDATE_PAGE_ID](pageId);
  });
}

const menu: MenuBarData = {
  left: [
    {
      type: 'text',
      text: '页面编辑器',
    },
  ],
  center: ['delete', 'undo', 'redo', 'guides', 'rule', 'zoom'],
  right: [
    // {
    //   type: 'button',
    //   text: 'Form Playground',
    //   handler: () => router.push('form'),
    // },
    // {
    //   type: 'button',
    //   text: 'Table Playground',
    //   handler: () => router.push('table'),
    // },
    '/',
    {
      type: 'button',
      text: '预览',
      icon: Connection,
      handler: async (services) => {
        if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
          try {
            await ElMessageBox.confirm('有修改未保存，是否先保存再预览', '提示', {
              confirmButtonText: '保存并预览',
              cancelButtonText: '预览',
              type: 'warning',
            });
            save();
            ElMessage.success('保存成功');
          } catch (e) {
            console.error(e);
          }
        }
        previewVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '保存',
      icon: Coin,
      handler: () => {
        save();
        // ElMessage.success('保存成功');
      },
    },
    {
      type: 'button',
      text: '发布',
      icon: Coin,
      handler: (services) => {
        ElMessageBox.confirm('是否马上发布', {
          confirmButtonText: '马上发布',
          cancelButtonText: '定时发布',
          type: 'warning',
        })
          .then(async () => {
            if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
              try {
                await ElMessageBox.confirm('有修改未保存，是否先保存再预览', '提示', {
                  confirmButtonText: '保存并预览',
                  cancelButtonText: '预览',
                  type: 'warning',
                });
                await save();
                ElMessage.success('保存成功');
                updatePageStatus({
                  id: pageId,
                  type: 1,
                }).then((res) => {
                  ElMessage.success('发布成功');
                });
              } catch (e) {
                console.error(e);
              }
            }
            updatePageStatus({
              id: pageId,
              type: 1,
            }).then((res) => {
              ElMessage.success('发布成功');
            });
          })
          .catch(() => {
            publishTimingDialog.value = true;
          });
      },
    },
    '/',
    {
      type: 'button',
      icon: Document,
      tooltip: '源码',
      handler: service => service?.uiService.set('showSrc', !service?.uiService.get('showSrc')),
    },
  ],
};

const moveableOptions = (core?: StageCore): MoveableOptions => {
  const options: MoveableOptions = {};
  const id = core?.dr?.target?.id;

  if (!id || !editor.value) return options;

  const node = editor.value.editorService.getNodeById(id);

  if (!node) return options;

  const isPage = node.type === NodeType.PAGE;

  options.draggable = !isPage;
  options.resizable = !isPage;
  options.rotatable = !isPage;

  return options;
};
const handleDelayPublish = async () => {
  await save();
  updatePageStatus({
    id: pageId,
    type: 1,
    publishTiming: publishTiming.value,
  }).then((res) => {
    ElMessage.success('定时发布成功');
    publishTimingDialog.value = false;
  });
};

const save = async () => {
  const rawObj = toRaw(value.value);
  const DSL = serialize(rawObj, {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');
  localStorage.setItem('magicDSL', DSL);
  editor.value?.editorService.resetModifiedNodeId();
  console.log(rawObj);
  const pageName = get(rawObj, 'items[0].pageName');
  const shareTitle = get(rawObj, 'items[0].shareTitle');
  const relativeActivity = get(rawObj, 'items[0].relativeActivity');
  if (!pageName) {
    return ElMessage.warning('请填写页面名称');
  }
  if (!shareTitle) {
    return ElMessage.warning('请填写分享标题');
  }
  await updatePage({
    pageName,
    activityId: relativeActivity,
    id: pageId,
  });
  uploadOssJSON({ zoneId: pageId as string, jsonContent: JSON.stringify(rawObj) }).then((res) => {
    if (!status || status === 'copy') {
      ElMessage.success('新建页面成功');
    } else {
      ElMessage.success('修改页面成功');
    }
  });
};

asyncLoadJs(`${VITE_ENTRY_PATH}/config/index.umd.js`).then(() => {
  propsConfigs.value = (globalThis as any).magicPresetConfigs;
});
asyncLoadJs(`${VITE_ENTRY_PATH}/value/index.umd.js`).then(() => {
  propsValues.value = (globalThis as any).magicPresetValues;
});
asyncLoadJs(`${VITE_ENTRY_PATH}/event/index.umd.js`).then(() => {
  eventMethodList.value = (globalThis as any).magicPresetEvents;
});

// save();

editorService.usePlugin({
  beforeDoAdd: (config: MNode, parent?: MContainer | null) => {
    if (config.type === 'overlay') {
      config.style = {
        ...config.style,
        left: 0,
        top: 0,
      };

      return [config, editorService.get('page')];
    }
    if (config.type === 'navcom') {
      let isNavExist = false;
      const firstSurface = value.value.items[0].items;
      if (firstSurface.length > 0) {
        isNavExist = !!value.value.items[0].items.filter((item: any) => item.type === 'navcom')
          .length;
      }
      if (isNavExist) {
        ElMessage.warning('只能添加一个导航栏');
        throw new Error('只能添加一个导航栏');
      }
    }
    return [config, parent];
  },
});
</script>

<style lang="scss">
html {
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
}

.editor-app {
  width: 100%;
  height: 100%;

  .m-editor {
    flex: 1;
    height: 100%;
  }

  .el-overlay-dialog {
    display: flex;
  }

  .pre-viewer {
    margin: auto;

    .el-dialog__body {
      padding: 0;
    }
  }

  .menu-left {
    .menu-item-text {
      margin-left: 10px;
    }
  }
}
</style>
