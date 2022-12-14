<template>
  <div class="m-editor-nav-menu" :style="{ height: `${height}px` }">
    <div v-for="key in keys" :class="`menu-${key}`" :key="key" :style="`width: ${columnWidth?.[key]}px`">
      <tool-button :data="item" v-for="(item, index) in buttons[key]" :key="index"></tool-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, markRaw } from 'vue';
import { Back, Delete, FullScreen, Grid, Memo, Right, ScaleToOriginal, ZoomIn, ZoomOut } from '@element-plus/icons-vue';

import { NodeType } from '@tmagic/schema';

import ToolButton from '../components/ToolButton.vue';
import { ColumnLayout, GetColumnWidth, MenuBarData, MenuButton, MenuComponent, MenuItem, Services } from '../type';

const props = withDefaults(
  defineProps<{
    data?: MenuBarData;
    height?: number;
  }>(),
  {
    data: () => ({}),
    height: 35,
  },
);

const services = inject<Services>('services');
const uiService = services?.uiService;

const columnWidth = computed(() => services?.uiService.get<GetColumnWidth>('columnWidth'));
const keys = Object.values(ColumnLayout);

const showGuides = computed((): boolean => uiService?.get<boolean>('showGuides') ?? true);
const showRule = computed((): boolean => uiService?.get<boolean>('showRule') ?? true);
const zoom = computed((): number => uiService?.get<number>('zoom') ?? 1);

const isMac = /mac os x/.test(navigator.userAgent.toLowerCase());
const ctrl = isMac ? 'Command' : 'Ctrl';

const getConfig = (item: MenuItem): (MenuButton | MenuComponent)[] => {
  if (typeof item !== 'string') {
    return [item];
  }
  const config: (MenuButton | MenuComponent)[] = [];
  switch (item) {
    case '/':
      config.push({
        type: 'divider',
        className: 'divider',
      });
      break;
    case 'zoom':
      config.push(
        ...getConfig('zoom-out'),
        ...getConfig(`${parseInt(`${zoom.value * 100}`, 10)}%`),
        ...getConfig('zoom-in'),
        ...getConfig('scale-to-original'),
        ...getConfig('scale-to-fit'),
      );
      break;
    case 'delete':
      config.push({
        type: 'button',
        className: 'delete',
        icon: markRaw(Delete),
        tooltip: `??????(Delete)`,
        disabled: () => services?.editorService.get('node')?.type === NodeType.PAGE,
        handler: () => services?.editorService.remove(services?.editorService.get('node')),
      });
      break;
    case 'undo':
      config.push({
        type: 'button',
        className: 'undo',
        icon: markRaw(Back),
        tooltip: `??????(${ctrl}+z)`,
        disabled: () => !services?.historyService.state.canUndo,
        handler: () => services?.editorService.undo(),
      });
      break;
    case 'redo':
      config.push({
        type: 'button',
        className: 'redo',
        icon: markRaw(Right),
        tooltip: `??????(${ctrl}+Shift+z)`,
        disabled: () => !services?.historyService.state.canRedo,
        handler: () => services?.editorService.redo(),
      });
      break;
    case 'zoom-in':
      config.push({
        type: 'button',
        className: 'zoom-in',
        icon: markRaw(ZoomIn),
        tooltip: `??????(${ctrl}+=)`,
        handler: () => uiService?.zoom(0.1),
      });
      break;
    case 'zoom-out':
      config.push({
        type: 'button',
        className: 'zoom-out',
        icon: markRaw(ZoomOut),
        tooltip: `??????(${ctrl}+-)`,
        handler: () => uiService?.zoom(-0.1),
      });
      break;
    case 'scale-to-original':
      config.push({
        type: 'button',
        className: 'scale-to-original',
        icon: markRaw(ScaleToOriginal),
        tooltip: `?????????????????????(${ctrl}+1)`,
        handler: () => uiService?.set('zoom', 1),
      });
      break;
    case 'scale-to-fit':
      config.push({
        type: 'button',
        className: 'scale-to-fit',
        icon: markRaw(FullScreen),
        tooltip: `???????????????(${ctrl}+0)`,
        handler: async () => uiService?.set('zoom', await uiService.calcZoom()),
      });
      break;
    case 'rule':
      config.push({
        type: 'button',
        className: 'rule',
        icon: markRaw(Memo),
        tooltip: showRule.value ? '????????????' : '????????????',
        handler: () => uiService?.set('showRule', !showRule.value),
      });
      break;
    case 'guides':
      config.push({
        type: 'button',
        className: 'guides',
        icon: markRaw(Grid),
        tooltip: showGuides.value ? '???????????????' : '???????????????',
        handler: () => uiService?.set('showGuides', !showGuides.value),
      });
      break;
    default:
      config.push({
        type: 'text',
        text: item,
      });
  }
  return config;
};

const buttons = computed(() => {
  const data: {
    [ColumnLayout.LEFT]: (MenuButton | MenuComponent)[];
    [ColumnLayout.CENTER]: (MenuButton | MenuComponent)[];
    [ColumnLayout.RIGHT]: (MenuButton | MenuComponent)[];
  } = {
    [ColumnLayout.LEFT]: [],
    [ColumnLayout.CENTER]: [],
    [ColumnLayout.RIGHT]: [],
  };
  keys.forEach((key) => {
    const items = props.data[key] || [];
    items.forEach((item) => {
      data[key].push(...getConfig(item));
    });
  });
  return data;
});
</script>
