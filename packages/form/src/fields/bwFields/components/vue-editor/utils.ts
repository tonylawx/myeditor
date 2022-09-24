import { message } from 'ant-design-vue';
import mimeTypes from 'mime-types';
import short from 'short-uuid';

import { uploadToOss } from '../../utils/oss';

type InsertFnType = (url: string, alt: string, href: string) => void;

/** 图片/视频自定义上传方法 */
export const handleCustomUpload = (
  file: File,
  insertFn: InsertFnType,
  props,
  key?: string, // loading 唯一标识
) => {
  const { type } = file;
  const { env, filePath, ossConfig, dsn, convertType } = props;
  const otherType = mimeTypes.extension(type);
  const imageType = convertType || type.split('/')[1];

  const msgStyle = {
    marginTop: '25vh',
  };
  message.loading({
    content: '上传文件中...',
    key,
    duration: 0,
    style: msgStyle,
  });

  // 组装上传路径
  const path =
    type.indexOf('image') !== -1
      ? `/sys/${filePath}-${short.generate()}.${imageType}`
      : `/sys/${filePath}-${short.generate()}.${otherType}`;
  uploadToOss({ ...ossConfig, env }, file, path)
    .then((res: any) => {
      // 图片上传成功后，这里处理url
      // res对象中的url类似：https://test-bdw.oss-cn-shenzhen.aliyuncs.com/sys...
      // 域名访问：https://test.img.betterwood.com/sys...
      console.log('upload success---->', convertDsnUrl(env, dsn, res.url));
      message.success({
        content: '上传成功!',
        key,
        duration: 2,
        style: msgStyle,
      });

      // 得到文件url poster
      // 最后插入图片/视频 insertFn(url, alt, href)
      const link = convertDsnUrl(env, dsn, res.url);
      insertFn(link, file.name, link);
    })
    .catch(() => {
      message.error({
        content: '上传失败!',
        key,
        duration: 2,
        style: msgStyle,
      });
    });
};

const reg = /(?:http(?:s|):\/\/[^\/\s]+|)([^#?]+).*/;
const convertDsnUrl = (env, dsn: string, url: string): string => {
  if (!url) return '';
  if (!dsn) return url;

  const path = url.match(reg)?.[1];
  if (env === 'prod') return `https://${dsn}${path}`;
  if (env === 'uat') return `https://uat.${dsn}${path}`;
  return `https://test.${dsn}${path}`;
};

/** 修改图片配置相关 */
// 自定义校验图片
export const customCheckImageFn = (src: string, alt?: string, url?: string): boolean | undefined | string => {
  console.log('customCheckImageFn', src, alt, url);

  if (!src) {
    return;
  }
  if (src.indexOf('http') !== 0) {
    return '图片网址必须以 http/https 开头';
  }
  return true;

  // 返回值有三种选择：
  // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
  // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
  // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
};

/** 控制转换图片链接 */
export const customParseImageSrc = (src: string): string => {
  if (src.indexOf('http') !== 0) {
    return `http://${src}`;
  }
  return src;
};
