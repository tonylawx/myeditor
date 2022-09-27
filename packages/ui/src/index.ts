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

import Button from './button';
import Container from './container';
import GoodsDisplay from './goodsDisplay';
import Img from './img';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import Text from './text';
import GoodCom from './goodCom'
import GroupGoodCom from './groupgoodcom'
import ImgCom from './imgcom'
import TitleCom from './title'
import VideoCom from './video'
import FloatCom from  './float'
import CountCom from './countdown'
import Treasure from './treasure'
import RichText from './richtext'

const ui: Record<string, any> = {
  page: Page,
  container: Container,
  button: Button,
  text: Text,
  img: Img,
  qrcode: Qrcode,
  overlay: Overlay,
  goods: GoodsDisplay,
  goodcom:GoodCom,
  groupgoodcom:GroupGoodCom,
  imgcom:ImgCom,
  titlecom:TitleCom,
  videocom:VideoCom,
  floatcom:FloatCom,
  countcom:CountCom,
  treasurecom:Treasure,
  richtext:RichText
};

export default ui;
