/*
 * Tencent is pleased to support the open source community by making TMagicEditor available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export default [
  // {
  //   text: '页面标识',
  //   name: 'name',
  //   disabled: true,
  //   extra: '在多页面的情况下用来指定要打开的页面',
  // },
  {
    type: 'fieldset',
    labelWidth: 100,
    legend: '基础信息',
    items: [
      {
        text: '页面名称',
        name: 'pageName',
        placeholder: '请输入页面名称15字以内',
        trim: true,
      },
      {
        text: '所属活动',
        name: 'relativeActivity',
        type: 'activity-selector',
      },
      {
        text: '页面描述',
        name: 'pageDesc',
        type: 'textarea',
      },
      {
        text: '背景',
        name: 'bgOptions',
        type: 'background-selector',
      },
    ],
  },
  {
    type: 'fieldset',
    labelWidth: 100,
    legend: '分享信息',
    items: [
      {
        text: '分享标题',
        name: 'shareTitle',
        placeholder: '请输入分享标题15字已内',
        trim: true,
      },
      {
        text: '分享描述',
        name: 'shareDesc',
        type: 'textarea',
      },
      {
        text: '小程序分享图片',
        name: 'shareImg',
        type: 'upload-picture',
      },
    ],
  },
  {
    name: 'layout',
    text: '容器布局',
    type: 'select',
    defaultValue: 'relative',
    options: [
      { value: 'absolute', text: '绝对定位' },
      { value: 'relative', text: '流式布局' },
    ],
    onChange: (formState: any, v: string, { model }: any) => {
      if (!model.style) return v;
      if (v === 'relative') {
        model.style.height = 'auto';
      } else {
        const el = formState.stage?.renderer?.contentWindow.document.getElementById(model.id);
        if (el) {
          model.style.height = el.getBoundingClientRect().height;
        }
      }
    },
  },
];
