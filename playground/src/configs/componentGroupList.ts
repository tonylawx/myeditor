import { FolderOpened, Grid, PictureFilled, SwitchButton, Tickets } from '@element-plus/icons-vue';

export default [
  {
    title: '示例容器',
    items: [
      {
        icon: FolderOpened,
        text: '组',
        type: 'container',
      }
    ],
  },
  {
    title: '示例组件',
    items: [
      {
        icon: Grid,
        text: '商品组件',
        type: 'goodcom',
      },
      {
        icon: Grid,
        text: '分组商品组件',
        type: 'groupgoodcom',
      },
      {
        icon: Grid,
        text: '图片组件',
        type: 'imgcom',
      },
    ],
  },
];
