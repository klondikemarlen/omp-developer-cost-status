# Feature request: plugin-defined inline status-line segments

## Intent

**WHY this feature exists:** Plugins can publish footer text today, but only through the
hook-status surface. That separates comparable values from the built-in status line and leaves
layout whitespace controlled by OMP core.

**WHAT this feature produces:** A plugin API that lets plugins register status-line segments and
lets users place those segments in status-line config.

**Decision Rules:**
- **Comparable metrics belong together:** When a plugin displays a value users compare with
  built-in status metrics, allow it in the main status line, not only hook status.
- **Plugins should not fork layout:** When a plugin only needs placement or spacing control,
  expose a plugin-spec option instead of requiring a prompt/status renderer fork.
- **Removal must be safe:** When a plugin is missing or disabled, omit its registered segment
  without breaking the rest of the status line.

## Problem

This plugin needs to show developer cost where users already compare cost.

Current evidence from OMP 16.1.16:

- `ctx.ui.setStatus(...)` is implemented as `setHookStatus(...)`.
- `StatusLineComponent.render(...)` only renders hook statuses; the main inline status line is
  generated separately by `getTopBorder(...)` and placed in the editor top border.
- Custom status-line config can reorder built-in segment ids, but `StatusLineSegmentId` and
  `SEGMENTS` are a fixed built-in set. Plugin-provided ids are not registered.
- The layout adds `statusLine`, then `hookWidgetContainerAbove`, then `editorContainer`.
  `hookWidgetContainerAbove` owns the spacer between hook status and the editor, so tightening
  that gap also requires an OMP core layout change.

Current result:

- developer cost renders on a separate hook-status line
- Custom status-line config cannot place it next to built-in `cost`
- the extra whitespace below hook status cannot be removed from this plugin

## Request

Let plugins register inline status-line segments in the main status line.

Example shape:

```ts
registerStatusLineSegment({
  id: "developer_cost",
  render(ctx) {
    return {
      content: "$3.33 (dev)",
      visible: true,
    }
  },
})
```

And then allow plugin-defined ids inside:

- `statusLine.leftSegments`
- `statusLine.rightSegments`

## Why

Built-in `cost` and developer cost are different values.

- built-in `cost` = OMP/provider usage spend
- developer cost = human active-time spend

Users naturally compare those numbers together, so they should be placeable in the same inline
status line.

This also avoids using hook status as a visual workaround. Hook status is useful for temporary
extension messages, but it is not the right surface for persistent inline metrics because its
placement and spacing are controlled by OMP core.

## Acceptance criteria

- a plugin can register a new inline status-line segment
- users can place that segment in the Custom status-line config
- it renders in the main inline status line, not only the hook-status line below it
- it updates during a session without requiring a custom fork of the whole prompt/footer layout
- disabling or removing the plugin omits the segment cleanly

## Notes

If upstream will not support plugin-defined inline segments, the fallback is likely a fork or a new
extension point in the prompt/status renderer.
