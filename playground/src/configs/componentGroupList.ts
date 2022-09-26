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
      {
        icon: Grid,
        text: '标题组件',
        type: 'titlecom',
      },
      {
        icon: Grid,
        text: '视频组件',
        type: 'videwcom',
      },
      {
        icon: Grid,
        text: '倒计时组件',
        type: 'countcom',
      },
      {
        icon: Grid,
        text: '悬浮窗组件',
        type: 'floatcom',
      },
      {
        icon: Grid,
        text: '法宝组件',
        type: 'treasurecom',
      },
      {
        icon: Grid,
        text: '富文本',
        type: 'richtext',
      },
    ],
  },
];
