<template>
  <framework :code-options="codeOptions">
    <template #nav>
      <slot name="nav" :editorService="editorService"><nav-menu :data="menu"></nav-menu></slot>
    </template>

    <template #sidebar>
      <slot name="sidebar" :editorService="editorService">
        <sidebar :data="sidebar">
          <template #layer-panel-header>
            <slot name="layer-panel-header"></slot>
          </template>

          <template #component-list-panel-header>
            <slot name="component-list-panel-header"></slot>
          </template>

          <template #component-list-item="{ component }">
            <slot name="component-list-item" :component="component"></slot>
          </template>
        </sidebar>
      </slot>
    </template>

    <template #workspace>
      <slot name="workspace" :editorService="editorService">
        <workspace>
          <template #stage><slot name="stage"></slot></template>
          <template #workspace-content><slot name="workspace-content" :editorService="editorService"></slot></template>
          <template #page-bar-title="{ page }"><slot name="page-bar-title" :page="page"></slot></template>
          <template #page-bar-popover="{ page }"><slot name="page-bar-popover" :page="page"></slot></template>
        </workspace>
      </slot>
    </template>

    <template #props-panel>
      <slot name="props-panel">
        <props-panel @mounted="(instance: any) => $emit('props-panel-mounted', instance)">
          <template #props-panel-header>
            <slot name="props-panel-header"></slot>
          </template>
        </props-panel>
      </slot>
    </template>

    <template #empty><slot name="empty" :editorService="editorService"></slot></template>
  </framework>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType, provide, reactive, toRaw, watch } from 'vue';

import { EventOption } from '@tmagic/core';
import type { FormConfig } from '@tmagic/form';
import type { MApp, MNode } from '@tmagic/schema';
import type StageCore from '@tmagic/stage';
import { CONTAINER_HIGHLIGHT_CLASS, ContainerHighlightType, MoveableOptions } from '@tmagic/stage';

import Framework from './layouts/Framework.vue';
import NavMenu from './layouts/NavMenu.vue';
import PropsPanel from './layouts/PropsPanel.vue';
import Sidebar from './layouts/sidebar/Sidebar.vue';
import Workspace from './layouts/workspace/Workspace.vue';
import componentListService from './services/componentList';
import editorService from './services/editor';
import eventsService from './services/events';
import historyService from './services/history';
import propsService from './services/props';
import storageService from './services/storage';
import uiService from './services/ui';
import type { ComponentGroup, MenuBarData, MenuButton, MenuComponent, Services, SideBarData, StageRect } from './type';

export default defineComponent({
  name: 'm-editor',

  components: {
    NavMenu,
    Sidebar,
    Workspace,
    PropsPanel,
    Framework,
  },

  props: {
    /** ??????????????? */
    modelValue: {
      type: Object as PropType<MApp>,
      default: () => ({}),
      require: true,
    },

    /** ?????????????????????????????? */
    componentGroupList: {
      type: Array as PropType<ComponentGroup[]>,
      default: () => [],
    },

    /** ?????????????????? */
    sidebar: {
      type: Object as PropType<SideBarData>,
    },

    layerContentMenu: {
      type: Array as PropType<(MenuButton | MenuComponent)[]>,
      default: () => [],
    },

    stageContentMenu: {
      type: Array as PropType<(MenuButton | MenuComponent)[]>,
      default: () => [],
    },

    /** ????????????????????? */
    menu: {
      type: Object as PropType<MenuBarData>,
      default: () => ({ left: [], right: [] }),
    },

    /** ?????????????????????????????????????????? */
    render: {
      type: Function as PropType<() => HTMLDivElement>,
    },

    /** ?????????????????????????????????iframe??????????????????url */
    runtimeUrl: String,

    /** ?????????????????????????????????????????? */
    autoScrollIntoView: Boolean,

    /** ??????????????????????????????dsl */
    propsConfigs: {
      type: Object as PropType<Record<string, FormConfig>>,
      default: () => ({}),
    },

    /** ??????????????????????????? */
    propsValues: {
      type: Object as PropType<Record<string, MNode>>,
      default: () => ({}),
    },

    /** ?????????????????????????????? */
    eventMethodList: {
      type: Object,
      default: () => ({}),
    },

    /** ??????????????????????????????????????? */
    moveableOptions: {
      type: [Object, Function] as PropType<MoveableOptions | ((core?: StageCore) => MoveableOptions)>,
    },

    /** ??????????????????????????????????????????ID */
    defaultSelected: {
      type: [Number, String],
    },

    canSelect: {
      type: Function as PropType<(el: HTMLElement) => boolean | Promise<boolean>>,
      default: (el: HTMLElement) => Boolean(el.id),
    },

    isContainer: {
      type: Function as PropType<(el: HTMLElement) => boolean | Promise<boolean>>,
      default: (el: HTMLElement) => el.classList.contains('magic-ui-container'),
    },

    containerHighlightClassName: {
      type: String,
      default: CONTAINER_HIGHLIGHT_CLASS,
    },

    containerHighlightDuration: {
      type: Number,
      default: 800,
    },

    containerHighlightType: {
      type: String as PropType<ContainerHighlightType>,
      default: ContainerHighlightType.DEFAULT,
    },

    stageRect: {
      type: [String, Object] as PropType<StageRect>,
    },

    codeOptions: {
      type: Object,
      default: () => ({}),
    },

    updateDragEl: {
      type: Function as PropType<(el: HTMLDivElement, target: HTMLElement) => void>,
    },
  },

  emits: ['props-panel-mounted', 'update:modelValue'],

  setup(props, { emit }) {
    editorService.on('root-change', (value) => {
      const node = editorService.get<MNode | null>('node');
      const nodeId = node?.id || props.defaultSelected;
      if (nodeId && node !== value) {
        editorService.select(nodeId);
      } else {
        editorService.set('nodes', [value]);
      }

      emit('update:modelValue', toRaw(editorService.get('root')));
    });

    // ??????????????????????????????????????????
    watch(
      () => props.modelValue,
      (modelValue) => editorService.set('root', modelValue),
      {
        immediate: true,
      },
    );

    watch(
      () => props.componentGroupList,
      (componentGroupList) => componentListService.setList(componentGroupList),
      {
        immediate: true,
      },
    );

    watch(
      () => props.propsConfigs,
      (configs) => propsService.setPropsConfigs(configs),
      {
        immediate: true,
      },
    );

    watch(
      () => props.propsValues,
      (values) => propsService.setPropsValues(values),
      {
        immediate: true,
      },
    );

    watch(
      () => props.eventMethodList,
      (eventMethodList) => {
        const eventsList: Record<string, EventOption[]> = {};
        const methodsList: Record<string, EventOption[]> = {};

        Object.keys(eventMethodList).forEach((type: string) => {
          eventsList[type] = eventMethodList[type].events;
          methodsList[type] = eventMethodList[type].methods;
        });

        eventsService.setEvents(eventsList);
        eventsService.setMethods(methodsList);
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.defaultSelected,
      (defaultSelected) => defaultSelected && editorService.select(defaultSelected),
      {
        immediate: true,
      },
    );

    watch(
      () => props.stageRect,
      (stageRect) => stageRect && uiService.set('stageRect', stageRect),
      {
        immediate: true,
      },
    );

    onUnmounted(() => {
      editorService.destroy();
      historyService.destroy();
      propsService.destroy();
      uiService.destroy();
      componentListService.destroy();
      storageService.destroy();
    });

    const services: Services = {
      componentListService,
      eventsService,
      historyService,
      propsService,
      editorService,
      uiService,
      storageService,
    };

    provide('services', services);

    provide('layerContentMenu', props.layerContentMenu);
    provide('stageContentMenu', props.stageContentMenu);
    provide(
      'stageOptions',
      reactive({
        runtimeUrl: props.runtimeUrl,
        autoScrollIntoView: props.autoScrollIntoView,
        render: props.render,
        moveableOptions: props.moveableOptions,
        canSelect: props.canSelect,
        updateDragEl: props.updateDragEl,
        isContainer: props.isContainer,
        containerHighlightClassName: props.containerHighlightClassName,
        containerHighlightDuration: props.containerHighlightDuration,
        containerHighlightType: props.containerHighlightType,
      }),
    );

    return services;
  },
});
</script>
