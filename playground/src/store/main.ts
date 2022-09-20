import { LocalStorage } from '@bdwjs/localstorage';
import { defineStore } from 'pinia';

import * as TYPES from './type';

type MainStore = {
  loginedToken: string | undefined;
  userInfo: unknown;
};

export const useMainStore = defineStore('main', {
  state: (): MainStore => ({
    loginedToken: LocalStorage.getItem('access_token') || undefined,
    userInfo: LocalStorage.getItem('userInfo') || undefined,
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
  },
});
