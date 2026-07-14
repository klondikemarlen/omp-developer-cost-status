export function parsePluginConfig(value) {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Project Time config must be an object.");
  }
  if (!("settings" in value) || value.settings === undefined) return {};
  if (
    typeof value.settings !== "object" ||
    value.settings === null ||
    Array.isArray(value.settings)
  ) {
    throw new Error("Project Time config settings must be an object.");
  }
  const settings = {};
  for (const [pluginName, pluginSettings] of Object.entries(value.settings)) {
    if (
      typeof pluginSettings !== "object" ||
      pluginSettings === null ||
      Array.isArray(pluginSettings)
    ) {
      throw new Error("Project Time plugin settings must be an object.");
    }
    settings[pluginName] = pluginSettings;
  }
  return { settings };
}
