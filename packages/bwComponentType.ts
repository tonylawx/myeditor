// @ts-ignore
import { MComponent } from '@tmagic/ui/src/types'

export interface IImgItem {
  url: string
  height: number
  width: number
  link: LinkOptions
}
type ImgComType =
  | 'swiper'
  | 'single'
  | 'columnTwo'
  | 'columnThree'
  | 'columnFour'
  | 'gridFour'
  | 'gridFive'
  | 'gridTian'
export interface MImgComItem {
  comType: ImgComType // swiper：轮播 single：单图 columnTwo：两列 columnThree：三列 columnFour：四列 GridFour：四宫格 GridFive：五宫格 GridTian：田字格
  swiperOptions: {
    auto: boolean,
    duration:string
  }
}
export interface MGoodComItem {
  groupName: string
  compId: string // 获取商品组件数据的ID
  comType: 'column' | 'list' | 'slide' // column：两列 list：列表 slide：侧滑
}
// 商品对象定义
export interface IGoodsItem {
  imgUrl: string
  name: string
  soldNum: string
}
/* 以下为业务（business）组件类型定义 */
/* goodCom(商品组件) */
export interface MGoodCom extends MComponent {
  goodComItem: Omit<MGoodComItem, 'groupName'>
}

/* groupgoodcom(分组商品组件) */
export interface MGroupGoodCom extends MComponent {
  groupNamePicked: string // 分组名称选中颜色
  groupNameUnPicked: string // 分组名称未选中颜色
  groupBgPicked: string // 分组底色选中颜色
  groupBgUnPicked: string // 分组底色未选中颜色
  groupGoodCom: MGoodComItem[]
}

/* hotgoodcom(榜单商品组件) */
export interface MHotGoodCom extends MComponent {
  goodComItem: Omit<MGoodComItem, 'groupName'>
}

/* imgcom(图片组件) */
export interface MImgCom extends MComponent {
  imgComItem: MImgComItem
  imgList: IImgItem[]
}
/* titlecom(标题组件) */
export interface MTitleCom extends MComponent {
  title: string
  fontSize: 'big' | 'middle' | 'small'
  fontColor: string
  bgColor: string
}
/* textcom(文本组件) */
export interface MTextCom extends MComponent {
  text: string
}
/* videwcom(视频组件) */
export interface MVideoCom extends MComponent {
  url: string
  bgUrl: string
}
/* countcom(倒计时组件) */
export interface MCountCom extends MComponent {
  activityName: string
  startTime: string
  endTime: string
}
export type LinkOptions ={
    type: 'MiniProgram'|'H5'|'Video'
  appId?: string;
    url: string
  }
/* floatcom(悬浮窗组件) */
export interface MFloatCom extends MComponent {
  bgUrl: string
  link: LinkOptions
  bottomDis: string
}
/* treasurecom(法宝组件) */
export interface MTreasureCom extends MComponent {
  comType: string // list：列表 slide：侧滑
  compId: string // id
}
