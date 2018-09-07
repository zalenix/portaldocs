
# Blades 

## Overview

Blades are the main UI container in the Portal. They are equivalent to `windows` or `pages` in other UX frameworks.  A blade typically takes up the full screen, has a presence in the Portal breadcrumb, and has an 'X' button to close it. The `TemplateBlade` is the recommended development model, which typically contains an import statement, an HTML template for the UI, and a ViewModel that contains the logic that binds to the HTML template. However, a few other development models are supported.     

The following is a list of different types of blades.

| Type                          | Document           | Description |
| ----------------------------- | ---- | ---- |
| TemplateBlade                 | [top-blades-templateblade.md](top-blades-templateblade.md) | Creating any Portal blade. This is the main and recommended authoring model for UI in the Portal. (Recommended) |
| MenuBlade                     | [top-blades-menublade.md](top-blades-menublade.md) | Displays a vertical menu at the left of a blade.      |
| Resource MenuBlade       |   [top-blades-resourcemenublade.md](top-blades-resourcemenublade.md)  | A specialized version of MenuBlade that adds support for standard Azure resource features.  | 
| Context Blades     |   [top-extensions-context-panes.md](top-extensions-context-panes.md)  | A specialized version of Blade that does not scroll horizontally.   | 
| Blade Settings | [top-blades-settings.md](top-blades-settings.md) | Settings that  standardize key interaction patterns across resources. | 
| FrameBlades       | [top-blades-frameblade.md](top-blades-frameblade.md)  | Provides an IFrame to host the UI. Be advised that if you go this route you get great power and responsibility. You will own the DOM, which means you can build any UI you can dream up. You cannot use Ibiza controls meaning you will have an increased responsibility in terms of accessibility, consistency, and theming.  |
| Opening and Closing Blades    | [top-blades-opening-and-closing.md](top-blades-opening-and-closing.md) | Opening and closing blades, within an extension and from a separate extension.  |
| Advanced TemplateBlade Topics    | [top-blades-advanced.md](top-blades-advanced.md) | More blade development techniques.  |
| Blade with tiles   | [top-blades-legacy.md](top-blades-legacy.md)  |  Legacy authoring model. Deprecated due to its complexity. | 

 {"gitdown": "include-file", "file": "portalfx-extensions-faq-blades.md"}

<!--
 gitdown": "include-file", "file": "portalfx-extensions-glossary-blades.md"}
-->