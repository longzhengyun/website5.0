import linksJson from '../data/links.json';
import versionLogsJson from '../data/version-log.json';
import { linksSchema, versionLogsSchema, type LinkItem, type VersionLog } from './schemas';

const links = linksSchema.parse(linksJson);
const versionLogs = versionLogsSchema.parse(versionLogsJson);

const LINK_GROUP_ORDER = ['技术', '工具', '其他'] as const;

export type LinkGroup = {
  label: (typeof LINK_GROUP_ORDER)[number];
  items: LinkItem[];
};

export function getLinkGroups(maxPerGroup = 6): LinkGroup[] {
  return LINK_GROUP_ORDER.map((label) => ({
    label,
    items: links
      .filter((link) => link.category === label)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB || a.title.localeCompare(b.title, 'zh-CN');
      })
      .slice(0, maxPerGroup),
  })).filter((group) => group.items.length > 0);
}

export function getVersionLogs(): VersionLog[] {
  return [...versionLogs].sort((a, b) => b.date.localeCompare(a.date, 'en'));
}
