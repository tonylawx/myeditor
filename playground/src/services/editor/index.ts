import axios from 'axios';

import { request } from '../../utils/request';

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
    url: `https://test.img.betterwood.com/sys/hotelArea/json/${pageId}.json?stamp=${new Date().getTime()}`,
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
