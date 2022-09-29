import Oss from 'ali-oss';

export type ENV = 'test' | 'dev' | 'uat' | 'prod';
export interface OssConfig {
  env?: ENV
  region?: string
  accessKeyId?: string
  accessKeySecret?: string
}

export const envMap = {
  test: 'delonix-test',
  dev: 'delonix-test',
  uat: 'delonix-uat',
  prod: 'delonix-prod',
};

export const getOssConfig = (config: OssConfig) => {
  console.log('config   ------------>', config);
  const { env, ...others } = config;
  return new Oss({
    secure: true,
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI5tRTXJ7uUrsxz4f6ZVyt',
    accessKeySecret: 'lMeogZ8wUYWcSjqqDo7hkt2QuO7Ckq',
    ...others,
    bucket: env ? envMap[env] : 'delonix-test',
    timeout: 600000,
  });
};
export const uploadToOss = (config: OssConfig, file: any, url: string) => {
  console.log('uploadToOss 222222 -------->', config);
  return new Promise((resolve, reject) => {
    getOssConfig(config)
      .put(url, file)
      .then((res: any) => {
        resolve(res);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const delFromOss = (config: OssConfig, url: string) => {
  console.log(config, 'config+++');
  console.log(url, 'url+++');
  return new Promise((resolve, reject) => {
    getOssConfig(config)
      .delete(url)
      .then(() => {
        resolve(true);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
