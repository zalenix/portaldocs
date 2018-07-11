
<a name="styling-an-extension"></a>
# Styling an Extension

<a name="styling-an-extension-overview"></a>
## Overview

The portal includes a built in list of CSS classes that may be used in templates.

Browse the following topics to learn about portal styling.

* [Style sanitization](top-style-guide-html-css-sanitization.md)

* [Adding Custom CSS](top-style-guide-custom-css.md)

* [Layout classes](top-style-guide-layout.md)

* [Typography](top-style-guide-typography.md)

* [Iconography](top-style-guide-iconography.md)

* [Theming](top-style-guide-theming.md)

* [Utility classes](top-style-guide-utility-classes.md)

* [Color Palette](top-style-guide-color-palette.md)


<!--
 gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-style-guide.md"}
-->


<a name="styling-an-extension-best-practices"></a>
## Best Practices

<a name="styling-an-extension-best-practices-general-best-practices"></a>
### General Best Practices

Do not use JavaScript reserved words, as specified in [https://docs.microsoft.com/en-us/scripting/javascript/reference/javascript-reserved-words](https://docs.microsoft.com/en-us/scripting/javascript/reference/javascript-reserved-words), as names for the icons in your extension.



<a name="styling-an-extension-best-practices-icon-incorrectly-displayed"></a>
### Icon incorrectly displayed

***My icon is black!?!***

DESCRIPTION:

The extension  probably circumvents the  icon pre-processing which happens at build time. This pre-processing  prepares the icon to pass the  html sanitizer, which may be why it appears to be black.  The pre-procesor also minifies it, and prepares the icon to react to different themes. 

**NOTE**: The icon may display incorrectly if it is served by using **json**.

SOLUTION: 

Include the icon in your project normally. Build and  look at the generated file.  Find and copy the  fresh sanitized svg markup, and replace it.

* * *
 
<a name="styling-an-extension-best-practices-"></a>
### 

SOLUTION:

* * *
<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-style-guide.md"}
-->