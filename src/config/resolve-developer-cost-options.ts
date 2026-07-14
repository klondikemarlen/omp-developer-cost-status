import type { DeveloperCostOptions } from "@/billing/index.js"
import { PLUGIN_NAME } from "@/config/plugin-name.js"
import type { PluginConfig } from "@/config/parse-plugin-config.js"
import { settingsForPlugin } from "@/config/settings-for-plugin.js"

export function resolveDeveloperCostOptions(
  globalConfig: PluginConfig | undefined,
  projectConfig: PluginConfig | undefined,
): DeveloperCostOptions {
  return {
    ...settingsForPlugin(globalConfig, PLUGIN_NAME),
    ...settingsForPlugin(projectConfig, PLUGIN_NAME),
  }
}
