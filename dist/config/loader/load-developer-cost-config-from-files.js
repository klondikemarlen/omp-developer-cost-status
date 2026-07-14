import { parseDeveloperCostConfig } from "../../billing/index.js";
import { readDeveloperCostConfigFile } from "../../config/loader/read-developer-cost-config-file.js";
import { parsePluginConfig } from "../../config/parse-plugin-config.js";
import { resolveDeveloperCostOptions } from "../../config/resolve-developer-cost-options.js";

export async function loadDeveloperCostConfigFromFiles(
  pluginsLockfile,
  projectPluginOverrides,
) {
  const [rawGlobalConfig, rawProjectConfig] = await Promise.all([
    readDeveloperCostConfigFile(pluginsLockfile),
    readDeveloperCostConfigFile(projectPluginOverrides),
  ]);
  return parseDeveloperCostConfig(
    resolveDeveloperCostOptions(
      parsePluginConfig(rawGlobalConfig),
      parsePluginConfig(rawProjectConfig),
    ),
  );
}

export default loadDeveloperCostConfigFromFiles;
