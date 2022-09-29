import { FolderOpened, Grid, PictureFilled, SwitchButton, Tickets } from '@element-plus/icons-vue';

export default [
  {
    title: '基础组件',
    items: [
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
        text: '富文本',
        type: 'richtext',
      },
      {
        icon: Grid,
        text: '底部导航栏',
        type: 'navcom',
      },
    ],
  },
  {
    title: '业务组件',
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
        text: '榜单商品',
        type: 'hotgood',
      },
    ],
  },
  {
    title: '营销组件',
    items: [
      {
        icon: Grid,
        text: '法宝组件',
        type: 'treasurecom',
      },
    ],
  },
  {
    title: '示例容器',
    items: [
      {
        icon: FolderOpened,
        text: '组',
        type: 'container',
      },
      {
        icon: FolderOpened,
        text: '蒙层',
        type: 'overlay',
      },
    ],
  },
  {
    title: '示例组件',
    items: [
      {
        icon: Tickets,
        text: '文本',
        type: 'text',
      },
      {
        icon: SwitchButton,
        text: '按钮',
        type: 'button',
      },
      {
        icon: PictureFilled,
        text: '图片',
        type: 'img',
      },
      {
        icon: Grid,
        text: '二维码',
        type: 'qrcode',
      },
    ],
  },
  {
    title: '组合',
    items: [
      {
        icon: Tickets,
        text: '弹窗',
        data: {
          type: 'overlay',
          style: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          name: '弹窗',
          items: [
            {
              type: 'container',
              style: {
                position: 'absolute',
                width: '80%',
                height: '400',
                top: '143.87',
                left: 37.5,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              },
              name: '组',
              items: [],
              layout: 'absolute',
            },
          ],
        },
      },
    ],
  },
];
