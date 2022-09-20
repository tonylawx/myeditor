import md5 from 'js-md5';
import { nanoid } from 'nanoid';
import { UAParser } from 'ua-parser-js';

const uaParser = new UAParser(window.navigator.userAgent);

const os = uaParser.getOS();
const browser = uaParser.getBrowser();

const defaultSettings = {
  ClientType: '7',
  OsVersion: `${os.name || ''} ${os.version || '1.0.0'}`,
  DeviceManufacture: `${browser.name || 'browser'} ${browser.version || '1.0.0'}`,
  DeviceModel: `${browser.name || 'browser'}`,
  AppVersion: '1.0.0',
  Channel: 'web',
};

export async function addSignHeaders(headers: any, url: string) {
  const MessageId = nanoid();

  const { Authorization } = headers;

  if (url.startsWith('http')) {
    url = url.split('betterwood.com')[1];
  }
  if (url.startsWith('/api/')) {
    url = url.split('/api')[1];
  }
  const Url = encodeURIComponent(`${url.startsWith('/') ? url : `/${url}`}`.split('?')[0]);

  const Signature = getSignature({
    MessageId,
    ...defaultSettings,
    Authorization,
    Url,
    UserAgent: window.navigator.userAgent,
  });

  Object.assign(headers, {
    MessageId,
    ...defaultSettings,
    Signature,
  });

  return headers;
}

// NOTE:生成Signature
export const getSignature = function (options: {
  OsVersion: string;
  DeviceManufacture: string;
  DeviceModel: string;
  ClientType: string;
  AppVersion: string;
  Channel: string;
  MessageId: string;
  Authorization?: string | undefined;
  Url: string;
  UserAgent: string;
}) {
  const authPart = options.Authorization ? `Authorization=${options.Authorization}` : ``;
  const output = `AppVersion=${options.AppVersion}${authPart}Channel=${options.Channel}ClientType=${options.ClientType}DeviceManufacture=${options.DeviceManufacture}DeviceModel=${options.DeviceModel}MessageId=${options.MessageId}OsVersion=${options.OsVersion}User-Agent=${options.UserAgent}AppKey=C49E2654AAA94F5085A9C12FE2CAB09CUrl=${options.Url}`;
  return md5(output.replace(/\s*/g, '')).substring(4, 28).toLocaleUpperCase();
};
