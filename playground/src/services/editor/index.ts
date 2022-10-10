import axios from 'axios';

import { request } from '../../utils/request';

const { VITE_DSL_PATH } = import.meta.env;

const menuPrefix = '/system';
export async function getRouter(backMenu = true) {
  return request({
    url: backMenu ? `${menuPrefix}/menu/getRouters` : `${menuPrefix}/menu/mp/getRouters`,
    method: 'GET',
  });
}

export interface IJSON {
  jsonContent: string;
  zoneId: string;
}
export function uploadOssJSON(params: IJSON) {
  return request({
    url: '/base-manage/file/upload/json',
    method: 'POST',
    data: params,
  });
}

export function getDSL(pageId: string) {
  return axios({
    url: `${VITE_DSL_PATH}${pageId}.json?stamp=${new Date().getTime()}`,
    method: 'GET',
  });
}
export interface ITreasureItem {
  brandName: string;
  magicName: string;
  stockNoSend?: any;
  stockType: number;
  type?: any;
  stockNoDistribute?: any;
  createTime?: any;
  brandId: string;
  moneyCost?: any;
  marketPrize?: any;
  id: string;
  state?: any;
  stock: number;
  times?: string;
}
export function queryTreasureList(): Promise<ITreasureItem[]> {
  return request({
    url: '/cms-manage/magic_center/query_list',
    method: 'GET',
  });
}
export interface Component2 {
  comment: string;
  componentType: number;
  paramId: string;
  paramName: string;
  paramPath: string;
  paramType: string;
  paramValue: string;
}

export interface Component {
  components: Component2[];
  comsId: string;
}

export interface IPageParams {
  activityId: string;
  components: Component[];
  id: string;
  pageName: string;
  pageStatus: string;
  pageUrl: string;
  publishTiming: string;
}

export function newPage(data: Partial<IPageParams>) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/add',
    method: 'POST',
    data,
  });
}

export function updatePage(data: Partial<IPageParams>) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/edit',
    method: 'POST',
    data,
  });
}
export function updateComponent(data: Partial<IPageParams>) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/editComs',
    method: 'POST',
    data,
  });
}
export interface IGoodsParams {
  current: number;
  goodsName: string;
  goodsRelateId: string;
  size: number;
}
export interface IGoodsItem {
  twoGoodsRelateName: string;
  showPrice: number;
  goodsId: number;
  shopName: string;
  shopId: number;
  oneGoodsRelateName: string;
  goodsName: string;
}

export interface Data {
  total: number;
  current: number;
  hitCount: boolean;
  pages: number;
  size: number;
  optimizeCountSql: boolean;
  records: IGoodsItem[];
  maxLimit?: any;
  searchCount: boolean;
  orders: any[];
  countId?: any;
}

export interface IGoodsResult {
  code: number;
  data: Data;
  errorCode?: any;
  errorDesc?: any;
  msg?: any;
  ok: boolean;
  successWithData: boolean;
}
export function getGoodList(data: Partial<IGoodsParams>) {
  return request({
    url: '/bdw-component-decoration-admin/merchStore/goods/list',
    method: 'POST',
    data,
  });
}
export function getGoodGroupList(data?: any) {
  return request({
    url: '/bdw-component-decoration-admin/merchStore/pageGoodsGroupList',
    method: 'POST',
    data: Object.assign(
      {},
      {
        current: 1,
        size: 9999,
      },
      data,
    ),
  });
}
export function getActEnum() {
  return request({
    url: '/bdw-component-decoration-admin/activity/enum/list',
    method: 'POST',
    data: {
      current: 1,
      size: 9999,
    },
  });
}
export function getAppletLinkList() {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/applet/path',
    method: 'POST',
  });
}
export function getConfPageList(data: any) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/list',
    method: 'POST',
    data,
  });
}
export function updatePageStatus(data: any) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/upOrDown',
    method: 'POST',
    data,
  });
}
