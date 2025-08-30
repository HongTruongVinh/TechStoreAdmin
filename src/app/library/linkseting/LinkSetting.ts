import resLinkSettingRaw from '../../../assets/document/reslink-api.json';
import { String } from '../share-function/string';

const resLinkSetting = resLinkSettingRaw as ResLinkSetting;

export class LinkSettings {
    public static GetResLinkSetting(pGroup: string, pFunction: string, ...pParams: any[]) {
        const link = resLinkSetting[pGroup][pFunction];
        return String.Format(link, pParams);
    }
}

interface ResLinkSetting {
    [group: string]: {
      [func: string]: string;
    };
}