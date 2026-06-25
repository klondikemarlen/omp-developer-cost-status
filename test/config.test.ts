import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"

import {
  loadDeveloperCostConfigFromFiles,
  readConfigSignature,
} from "../src/index.js"

const PLUGIN_NAME = "omp-developer-cost-status"

test("loads updated plugin settings from disk", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "developer-cost-config-"))
  const pluginsLockfile = path.join(directory, "omp-plugins.lock.json")
  const projectOverrides = path.join(directory, "missing-overrides.json")

  try {
    await writePluginSettings(pluginsLockfile, {
      monthlySalary: 6_500,
      label: "first",
    })

    const firstConfig = await loadDeveloperCostConfigFromFiles(pluginsLockfile, projectOverrides)

    assert.equal(firstConfig.monthlySalary, 6_500)
    assert.equal(firstConfig.label, "first")

    await writePluginSettings(pluginsLockfile, {
      monthlySalary: 9_000,
      refreshIntervalSeconds: 3,
      label: "second",
    })

    const secondConfig = await loadDeveloperCostConfigFromFiles(pluginsLockfile, projectOverrides)

    assert.equal(secondConfig.monthlySalary, 9_000)
    assert.equal(secondConfig.refreshIntervalSeconds, 3)
    assert.equal(secondConfig.label, "second")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("detects plugin settings changes and ignores unrelated lockfile changes", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "developer-cost-signature-"))
  const pluginsLockfile = path.join(directory, "omp-plugins.lock.json")

  try {
    await writePluginLockfile(pluginsLockfile, {
      [PLUGIN_NAME]: {
        monthlySalary: 6_500,
      },
      unrelatedPlugin: {
        enabled: true,
      },
    })

    const firstSignature = await readConfigSignature([pluginsLockfile])

    await writePluginLockfile(pluginsLockfile, {
      [PLUGIN_NAME]: {
        monthlySalary: 6_500,
      },
      unrelatedPlugin: {
        enabled: false,
      },
    })

    const unrelatedSignature = await readConfigSignature([pluginsLockfile])

    await writePluginLockfile(pluginsLockfile, {
      [PLUGIN_NAME]: {
        monthlySalary: 9_000,
      },
      unrelatedPlugin: {
        enabled: false,
      },
    })

    const secondSignature = await readConfigSignature([pluginsLockfile])

    assert.equal(unrelatedSignature, firstSignature)
    assert.notEqual(secondSignature, firstSignature)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

async function writePluginSettings(
  filePath: string,
  settings: Record<string, unknown>,
): Promise<void> {
  await writePluginLockfile(filePath, {
    [PLUGIN_NAME]: settings,
  })
}

async function writePluginLockfile(
  filePath: string,
  settings: Record<string, Record<string, unknown>>,
): Promise<void> {
  const content = JSON.stringify({
    settings,
  })

  await writeFile(filePath, content)
}
