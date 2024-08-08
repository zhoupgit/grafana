import { PluginExtensionLinkConfig } from '@grafana/data';
import { getExploreAddedLinks } from 'app/features/explore/extensions/getExploreAddedLinks';

export function getCoreAddedLinks(): PluginExtensionLinkConfig[] {
  return [...getExploreAddedLinks()];
}
