import { LocalStorage } from '@bdwjs/localstorage';
import { defineStore } from 'pinia';

import * as TYPES from './type';

type MainStore = {
  loginedToken: string | undefined;
  userInfo: unknown;
  pageId: string | undefined;
};

export const useMainStore = defineStore('main', {
  state: (): MainStore => ({
    loginedToken: LocalStorage.getItem('access_token') || undefined,
    userInfo: LocalStorage.getItem('userInfo') || undefined,
    pageId: LocalStorage.getItem('pageId') || undefined,
  }),
  actions: {
    [TYPES.UPDATE_TOKEN](loginedToken: string | undefined = undefined) {
      this.loginedToken = loginedToken;
      LocalStorage.setItem('access_token', loginedToken);
    },
    [TYPES.UPDATE_USERINFO](userInfo = undefined) {
      this.userInfo = userInfo;
      LocalStorage.setItem('userInfo', userInfo);
    },
    [TYPES.UPDATE_PAGE_ID](pageID = undefined) {
      this.pageId = pageID;
      LocalStorage.setItem('pageId', pageID);
    },
  },
});
