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

import { EventEmitter } from 'events';

import type { EventItemConfig, Id, MApp } from '@tmagic/schema';

import Env from './Env';
import {
  bindCommonEventListener,
  DEFAULT_EVENTS,
  getCommonEventName,
  isCommonMethod,
  triggerCommonMethod,
} from './events';
import type Node from './Node';
import Page from './Page';
import { fillBackgroundImage, isNumber, style2Obj } from './utils';

interface AppOptionsConfig {
  ua?: string;
  config?: MApp;
  platform?: 'editor' | 'mobile' | 'tv' | 'pc';
  jsEngine?: 'browser' | 'hippy';
  designWidth?: number;
  curPage?: Id;
  transformStyle?: (style: Record<string, any>) => Record<string, any>;
}

interface EventCache {
  eventConfig: EventItemConfig;
  fromCpt: any;
  args: any[];
}

class App extends EventEmitter {
  public env;

  public pages = new Map<Id, Page>();

  public page: Page | undefined;

  public platform = 'mobile';
  public jsEngine = 'browser';
  public designWidth = 375;

  public components = new Map();

  public eventQueueMap: Record<string, EventCache[]> = {};

  constructor(options: AppOptionsConfig) {
    super();

    this.env = new Env(options.ua);
    options.platform && (this.platform = options.platform);
    options.jsEngine && (this.jsEngine = options.jsEngine);
    options.designWidth && (this.designWidth = options.designWidth);

    // ???????????????????????????????????????font-size?????????rem???????????????
    if (this.platform === 'mobile' || this.platform === 'editor') {
      const calcFontsize = () => {
        let { width } = document.documentElement.getBoundingClientRect();
        width = Math.min(800, width);
        const fontSize = width / (this.designWidth / 100);
        document.documentElement.style.fontSize = `${fontSize}px`;
      };

      calcFontsize();

      document.body.style.fontSize = '14px';

      globalThis.addEventListener('resize', calcFontsize);
    }

    if (options.transformStyle) {
      this.transformStyle = options.transformStyle;
    }

    options.config && this.setConfig(options.config, options.curPage);

    bindCommonEventListener(this);
  }

  /**
   * ???dsl??????style???????????????css???????????????????????????rem??????????????????????????????100???????????????1rem
   * @param style Object
   * @returns Object
   */
  public transformStyle(style: Record<string, any> | string) {
    if (!style) {
      return {};
    }

    let styleObj: Record<string, any> = {};
    const results: Record<string, any> = {};

    if (typeof style === 'string') {
      styleObj = style2Obj(style);
    } else {
      styleObj = { ...style };
    }

    const whiteList = ['zIndex', 'opacity', 'fontWeight'];
    Object.entries(styleObj).forEach(([key, value]) => {
      if (key === 'backgroundImage') {
        value && (results[key] = fillBackgroundImage(value));
      } else if (key === 'transform' && typeof value !== 'string') {
        const values = Object.entries(value as Record<string, string>)
          .map(([transformKey, transformValue]) => {
            if (!transformValue.trim()) return '';
            if (transformKey === 'rotate' && isNumber(transformValue)) {
              transformValue = `${transformValue}deg`;
            }
            return `${transformKey}(${transformValue})`;
          })
          .join(' ');
        results[key] = !values.trim() ? 'none' : values;
      } else if (!whiteList.includes(key) && value && /^[-]?[0-9]*[.]?[0-9]*$/.test(value)) {
        results[key] = `${value / 100}rem`;
      } else {
        results[key] = value;
      }
    });

    return results;
  }

  /**
   * ??????dsl
   * @param config dsl?????????
   * @param curPage ????????????id
   */
  public setConfig(config: MApp, curPage?: Id) {
    this.pages = new Map();

    config.items?.forEach((page) => {
      this.pages.set(
        page.id,
        new Page({
          config: page,
          app: this,
        }),
      );
    });

    this.setPage(curPage || this.page?.data?.id);
  }

  public setPage(id?: Id) {
    let page;

    if (id) {
      page = this.pages.get(id);
    }

    if (!page) {
      page = this.pages.get(this.pages.keys().next().value);
    }

    this.page = page;

    if (this.platform !== 'magic') {
      this.bindEvents();
    }
  }

  public registerComponent(type: string, Component: any) {
    this.components.set(type, Component);
  }

  public unregisterComponent(type: string) {
    this.components.delete(type);
  }

  public resolveComponent(type: string) {
    return this.components.get(type);
  }

  public bindEvents() {
    if (!this.page) return;

    this.removeAllListeners();

    for (const [, value] of this.page.nodes) {
      value.events?.forEach((event) => this.bindEvent(event, `${value.data.id}`));
    }
  }

  public bindEvent(event: EventItemConfig, id: string) {
    let { name: eventName } = event;
    if (DEFAULT_EVENTS.findIndex((defaultEvent) => defaultEvent.value === eventName) > -1) {
      // common ??????????????? node id ??????????????????
      eventName = getCommonEventName(eventName, id);
    }

    this.on(`${eventName}_${id}`, (fromCpt: Node, ...args) => {
      this.eventHandler(event, fromCpt, args);
    });
  }

  public emit(name: string | symbol, node: any, ...args: any[]): boolean {
    if (typeof node.data === 'undefined') {
      return super.emit(name, node, ...args);
    }
    return super.emit(`${String(name)}_${node.data.id}`, ...args);
  }

  public eventHandler(eventConfig: EventItemConfig, fromCpt: any, args: any[]) {
    if (!this.page) throw new Error('??????????????????');

    const { method: methodName, to } = eventConfig;

    const toNode = this.page.getNode(to);
    if (!toNode) throw `ID???${to}??????????????????`;

    if (isCommonMethod(methodName)) {
      return triggerCommonMethod(methodName, toNode);
    }

    if (toNode.instance) {
      if (typeof toNode.instance[methodName] === 'function') {
        toNode.instance[methodName](fromCpt, ...args);
      }
    } else {
      this.addEventToMap({
        eventConfig,
        fromCpt,
        args,
      });
    }
  }

  public destroy() {
    this.removeAllListeners();
    this.pages.clear();
  }

  private addEventToMap(event: EventCache) {
    if (this.eventQueueMap[event.eventConfig.to]) {
      this.eventQueueMap[event.eventConfig.to].push(event);
    } else {
      this.eventQueueMap[event.eventConfig.to] = [event];
    }
  }
}

export default App;
