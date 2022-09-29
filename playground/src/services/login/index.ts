import { request } from '../../utils/request';
/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request<API.LoginResult>({
    url: '/authsys/v1/login',
    method: 'POST',
    data,
  });
}

/**
 * @description 登出
 */
export function logout() {
  return request({
    url: '/authsys/logout',
    method: 'DELETE',
  });
}

export async function getUserInfo() {
  const res = await request({
    url: '/system/user/v1_getInfo',
    method: 'GET',
  });
  // @ts-ignore
  res.data.user.userName = res.data.user.name || '';
  res.data.user.avatar = '';
  res.data.roles = ['admin'];
  res.data.permissions = ['*:*:*'];
  return res.data;
}

const menuPrefix = '/system';
export async function getRouter(backMenu = true) {
  return request({
    url: backMenu ? `${menuPrefix}/menu/getRouters` : `${menuPrefix}/menu/mp/getRouters`,
    method: 'GET',
  });
}
export function gePageId(params: {
  'pageName': string
  'pageStatus': string
  'pageUrl'?: string
}) {
  return request({
    url: '/bdw-component-decoration-admin/activity/page/add',
    method: 'POST',
    data: params,
  });
}
export interface IJSON {
  jsonContent: string
  zoneId: string
}
export function uploadOssJSON(params: IJSON) {
  return request({
    url: '/base-manage/file/upload/json',
    method: 'POST',
    data: params,
  });
}

export function getDSL(pageId: string) {
  return request({
    url: `https://test.img.betterwood.com/sys/hotelArea/json/${pageId}.json?stamp=${new Date().getTime()}`,
    method: 'GET',
  });
}
