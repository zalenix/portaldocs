
# Styling an Extension

## Overview

The portal includes a built in list of CSS classes that may be used in templates.

Browse the following topics to learn about portal styling.

* [HTML and CSS sanitization](#html-and-css-sanitization)

* [Adding Custom CSS](#adding-custom-css)

* [Layout classes](#layout-classes)

* [Theming](#theming)

* [Typography](#typography)

* [Iconography](#iconography)

* [Utility classes](#utility-classes)

* [Color Palette](#color-palette)

## HTML and CSS sanitization 

Extension writers provide their own HTML templates and associated Cascading Style Sheets (CSS) to render and style their experiences. Those files are analyzed at runtime to filter out disallowed HTML tags, attribute names, attribute values, CSS properties, or CSS property values that are known to have potential negative impact on the Portal. This filtering ensures a consistent and sandboxed experience in the Portal. Similar sanitization is also applied to SVG markup provided from the extension.

The sanitization philosophy is to allow as much CSS as possible for the extension to use based on a [whitelist](top-extensions-glossary.md). As such, developers may encounter items filtered out that are not explicitly called out in this document. Should this occur, developers should report the issue by using the [ibiza](https://stackoverflow.microsoft.com/questions/tagged/ibiza) tag on Stack Overflow.

For more information, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).

The criteria determining negative impact are as follows.

1. Usage allows an element to escape the tile or blade container boundaries
1. Usage impacts the layout/repaint performance of the browser significantly
1. Usage can be exploited as a possible security threat
1. Usage is non-standard across IE11, Microsoft Edge, Chrome, Firefox, and Safari.
1. Usage resets defaults font-family branding that is enforced for typographic consistency.
1. Usage assigns or relies on unique identifiers. Identifier allocation is reserved in the Portal for accessibility purposes.

### HTML sanitization

HTML sanitization is divided between HTML tags and their attributes.

### HTML tags

The `iframe` tag is not allowed based on criterion 3.

### HTML attributes

The `id` attribute is not allowed based on criterion 6. The `data-bind` value is sanitized to allow simple binding and logics, but no complex JavaScript is allowed.

### CSS sanitization

All CSS properties are allowed, with a few exceptions based on the criteria listed previously. The following properties are sanitized as described.

| Property | Criterion | Reason |
| -------- | --------- | ------- |
| position | Criterion 1 |  Only a subset of the possible values are allowed: static, relative, absolute |
| font | Criterion 5 |  Disallowed. Instead use expanded properties, like font-size, font-style, etc. |
| font-family |Criterion 5 |  Disallowed. Instead, use the portal classes that assign font-family: msportalfx-font-regular, msportalfx-font-bold, msportalfx-font-semibold, msportalfx-font-light, msportalfx-font-monospace |
| list-style | Criterion 3 |  Disallowed. Use expanded properties instead of the shorthand (list-style-type, etc) |
| user-select | Criterion 4 |  Disallowed. Use Framework class `msportalfx-unselectable` to achieve the same result. |

CSS media queries are not supported, and are filtered out. The most common scenario for media queries is responding to container size. Extensions support this feature by subscribing to the container ViewModel tile size property as specified  in [portalfx-no-pdl-programming.md](portalfx-no-pdl-programming.md), [top-legacy-parts.md](top-legacy-parts.md), and [top-extensions-forms.md](top-extensions-forms.md).

### SVG sanitization

SVG sanitization follows the rules applied to HTML sanitization, as they are both DOM structures. Before using SVGs directly in the Portal, convert them first using the build tools that are available on the Internet that sanitize SVG. 

Some SVG functionality, like certain filters, and gradients, are known to cause significant browser rendering slowdowns, as specified in Criterion 2.  As such, they are sanitized out. The build tools should detect those early and mitigate them when possible. Extension writers should rely on  [StackOverflow](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza) if the sanitization of SVG elements causes a blocking issue.

For more information about SVG sanitization, see [#iconography](#iconography).

## Adding custom css

Extension developers can combine commonly used classes into a CSS file. CSS styles that are defined in stylesheets are [sanitized](top-extensions-glossary.md) using the same rules as the `style` attribute (see below). All custom class names begin with the `.ext-` prefix that identifies them as classes that are owned by the extension. 

All developers who install the Portal Framework SDK that is located at [http://aka.ms/portalfx/download](http://aka.ms/portalfx/download) also install the samples on their computers during the installation process. The source for the samples is located in the `Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension` folder.

In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory and  `<dirParent>` is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. Links to the Dogfood environment are working copies of the samples that were made available with the SDK.

 Add a new CSS file to your extension to specify custom styles, as in the sample located at `<dir>\Client\V1\Parts\Custom\Styles\ExampleStyles.css`. This code is also included in the following example.

```css
.ext-too-many-clicks-box {
    color: red;
    border: 2px dotted red;
    padding: 8px;
    text-align: center;
}
```

CSS files can then be referenced from any PDL file inside  the `Definition` element, as in the  sample located at `<dir>\Client\V1\Parts\Custom\CustomParts.pdl`. This code is also included in the following example.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl" Area="Parts">
  <!--
    The following sample demonstrates the use of custom parts. Custom parts
    supply HTML templates and can be styled with custom style sheets.
  -->
  <StyleSheet Source="{Css Source='Styles\\ExampleStyles.css'}" />
  ...
</Definition>
```

The styles that are included in the CSS file can now be used inside HTML templates, as in the  sample located at `<dir>\Client\V1\Parts\Custom\Templates\ExampleCustomPart.html`.

```html
<div class="ext-too-many-clicks-box" data-bind="visible: !allowMoreClicks()">
    That's too many clicks!
    <button data-bind="click: resetClickCount">Reset</button>
</div>
```

## Layout classes

For the most part, you can lay out a blade the same way you would build an **html** page using [**Knockout**](http://knockoutjs.com/).  Layout should be handled by using CSS, as specified in [portalfx-style-guide-custom-css-file.md](portalfx-style-guide-custom-css-file.md).  The framework provides a number of [controls](top-extensions-controls.md) that you can use by using **Knockout** bindings.  In additional, the Framework provides a set of css classes you can add to elements to help with docking them to the top or bottom of the blade.

For more information about docking and controls, see [top-legacy-blades-template-pdl.md#adding-buttons](top-legacy-blades-template-pdl.md#adding-buttons).

### Controls that help out with layout

* Sections

    For layout of user input forms, as specified in [top-extensions-forms.md](top-extensions-forms.md), we provide a section control, which is just a container for other controls.  The section align its contained controls labels and padding in a consistent manner across the Portal.

* Tabs

    For tab layouts, we provide a tab control.  This control contains a collection of sections, each of which holds the contents of a tab.

* Custom Html

    We also provide a custom html control which allows you to combine a `ViewModel` and template with support for labels which behave in similar ways to those on form controls.  Custom html allows you to create your own controls to be used in sections or directly in your blade.

Sections, tabs and custom html can all be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).



## Typography 

Typography is associated with the formation of letters and words, and their impact on usability. The right  typography makes  extensions convey the  feeling  of accuracy, crispness, and polish.  Typography that is not as effective may be distracting and and commands more  attention than the content on which it was used.

To use a specific font-family, use one of the following CSS classes:

* Msportalfx-font-regular to get SegoeUI

* Msportalfx-font-bold to get SegoeUI-Bold

* Msportalfx-font-semibold to get SegoeUI-Semibold

* Msportalfx-font-light to get SegoeUI-Light


Azure extensions have considered the factors of font selection and placement, in addition to other linotype techniques, to provide typography that can be used consistently across extensions to display content in a way that the content is more important than the designs that display it.
The typography guidelines are located at [http://uni/DesignDepot.FrontEnd/#/ProductNav/49046/0/qv?t=Azure%20Portal%7CFramework%7CStyles](http://uni/DesignDepot.FrontEnd/#/ProductNav/49046/0/qv?t=Azure%20Portal%7CFramework%7CStyles).

For more information, see [https://developer.microsoft.com/en-us/windows/projects/campaigns/windows-dev-essentials-design-principles](https://developer.microsoft.com/en-us/windows/projects/campaigns/windows-dev-essentials-design-principles).



## Iconography 

The portal has some special requirements on the types of icons that can be used in parts, commands, or blades.  All icons are required to be SVG files, which allows icons to scale on high-resolution devices, and prepares them for automatic theming.

The SDK framework includes a large library of icons that can be used off the shelf, but developers can also provide their own icons.

### Setting up the project

Perform the following steps to set up the project to use Custom SVG files.

1. Add the following content to the .csproj file.

    ```xml
    <SvgTypeScriptCompile Include="Client\_generated\Svg.ts">
    <Namespace>SamplesExtension</Namespace>
    <IsAmd>true</IsAmd>
    </SvgTypeScriptCompile>
    ```

1. Add the SVG's to the project, and assign their build action to 'Svg', as in the following example.

    ```xml
    <Svg Include="Content\SamplesExtension\Images\sample.svg" />
    ```

1. Import the **Svg** module from the previous step in the code that will use custom images.

    ```ts
    import Svg = require ("./../_generated/Svg");
    ...
    this.icon(Svg.Content.SamplesExtension.Images.robot);
    ```

The extension should now reference the SVG images.

**NOTE**: Do not check the generated `Svg.ts` file in `Source Control`, because it updates whenever a reference to an svg is added, removed, or changed.

Typically, extensions also use custom SVG's in the `Icon` attribute of the PDL file, as in the following example.

  ```xml
     <AssetType Name="Engine"
                Text="{Resource engineSearchProviderKey, Module=ClientResources}"
                Icon="{Resource Content.SamplesExtension.Images.engine, Module=./../Generated/SvgDefinitions}"
                BladeName="EngineBlade"
                PartName="EnginePart">
  ```

### Customizing the Extension

After the basics of the extension icons are working, developers may want to use the following techniques to make the extension be more impressive.

#### Color Palettes

Most of the icons that the Framework provides are located in the root namespace.  An extension can change the color of all of the icons in the root namespace by using the 
`MsPortalFx.Base.Images.Add()` method, but not by using the `MsPortalFx.Base.Images.Polychromatic.PowerUp()` method.

To change the color, add the code `{palette: MsPortalFx.Base.ImagePalette.*}`  inside the function, as in the following code.

```ts
import CustomSvgImages = require("./SvgDefinitions.js");
...
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
	public icon = ko.observable<MsPortalFx.Base.Image>();

	constructor(dataContext: WebsitesDataContext) {
		this.icon(MsPortalFx.Base.Images.Delete({palette: MsPortalFx.Base.ImagePalette.Blue}));
	}
}
```

#### Custom data binding 

An extension can use custom data binding for the command bar with the `image` tag. This allows it to switch between SVG's and normal images while using the same data binding, as in the following code.

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
	public icon = ko.observable<MsPortalFx.Base.Image>();

	constructor(dataContext: WebsitesDataContext) {
		//SVG version
		//this.icon(MsPortalFx.Base.Images.Start());

		//PNG Version
		this.icon(MsPortalFx.Base.Images.ImageUri(MsPortalFx.Base.Resources.getContentUri("Content/RemoteExtension/Images/Website_Commandbar_Play.png")));
	}
}
```

#### Preserve icon colors over theme changes

For built-in monochromatic icons, also known as flat icons, the color changes are relative to the Portal's background color as the user changes themes. 

For a working copy, you can experiment with monochromatic blades in the sample located at [https://df.onecloud.azure-test.net/#blade/SamplesExtension/IconsMonochromaticBlade](https://df.onecloud.azure-test.net/#blade/SamplesExtension/IconsMonochromaticBlade).

In light themes, monochromatic icons are displayed in shades of black, as in the following image.

![alt-text](../media/portalfx-icons/monochromatic-light-theme.png "Flat icons with light theme")

In dark themes, monochromatic icons are displayed in shades of white, as in the following image.

![alt-text](../media/portalfx-icons/monochromatic-dark-theme.png "Flat icons with dark theme")

If the color of the icon should not be included in theme changes, send the `{ isLogo: true }` option to the icon's factory method. In the following example, the Delete icon remains black in all Portal themes.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/UI/ViewModels/Blades/IconBladeViewModels.ts", "section": "icon#flatIconWithLogoFlat"}

An alternative is to add custom color to an icon, and then send  `{isLogo: true}` to preserve the new colors. In the following example, the Delete icon  remains  blue in all Portal themes.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/UI/ViewModels/Blades/IconBladeViewModels.ts", "section": "icon#flatIconWithPaletteAndLogoFlat"}

### MsPortalFx.Base.Images

The following are special calls for icons that use the `MsPortalFx.Base` API.

  * `MsPortalFx.Base.Images.Blank()`
  
    Overrides the default icon and does not render any SVG element.

  * `MsPortalFx.Base.Images.Custom`
   
    This functionality is built into the SVG bundle definition, so the extension should not need to call it.  It triggers loading custom SVG's from the extension project.

  * `MsPortalFx.Base.Images.ImageUri`

    Adds non-SVG images.
    
    **NOTE**: Non-SVG images should not be used.
    
### Using the built in SVG's 

The following  is an example of using a built-in SVG on the command bar.

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(MsPortalFx.Base.Images.Delete());
    }
}
```

### Using the custom SVG's 

An extension can also use custom SVG's in the command bar, as in the following procedure.

1. Add SVGS's to your project  as specified in [#setting-up-the-project](#setting-up-the-project), except include  `<Svg Include="Content\Images\Commandbar_Trash.svg" />` in the project file.

1.  Assign their build action to 'Svg', as in the following AMD example.

```ts
import CustomSvgImages = require("./SvgDefinitions.js");
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(CustomSvgImages.Content.MsPortalFx.Images.commandbar_Trash);
    }
}
```

### Creating icons

The rules to use when creating SVG icons are as follows.

1. Use paths instead of stroke color.

1. Use the colors that are in the following approved list.

  `#ffffff`
  `#e5e5e5`
  `#a0a1a2`
  `#7a7a7a`
  `#3e3e3e` - Updates in dark theme.
  `#1e1e1e`
  `#0f0f0f` - Updates in dark theme.
  `#ba141a`
  `#dd5900`
  `#ff8c00`
  `#fcd116`
  `#fee087`
  `#b8d432`
  `#7fba00`
  `#59b4d9`
  `#3999c6`
  `#804998`
  `#ec008c`
  `#0072c6`
  `#68217a`
  `#00188f`
  `#e81123`

  The names of the colors, if web-safe, are specified in [https://www.w3schools.com/colors/colors_names.asp](https://www.w3schools.com/colors/colors_names.asp).  For example,  `#ffffff` is white.

### SVG tags 

Some, but not all, SVG tags are allowed by the Portal. The following table specifies the tags that are allowed, and their attributes.

| Tag      | Attributes |
| -------- | ---------- |
| SVG      | viewBox    |
| CIRCLE   | cx, cy, r, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| DEFS     | | 
| DESC     | |
| ELLIPSE  | cx, cy, rx, ry, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| G        | opacity |
| LINE     | x1, x2, y1, y2, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| PATH     | d, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| POLYGON  | points, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| POLYLINE | points, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| RECT     | width, height, x, y, rx, ry, stroke-dasharray, stroke-width, fill-rule, transform, opacity |
| TEXT     | transform, font-size |
| TITLE    | |

### Using built-in icons

The Portal comes with a set of SVG icons that are available for use with blades, parts, and commands.

<!-- TODO: Determine whether there is a way to include this content from the SDK samples.  -->

<!--
  I used a div here so the markdown parser would stop
  doing things to my CSS
-->

```
<div>
<style type="text/css">
  #icon-container h6, #icon-container h2 {
    padding-top: 20px;
    clear:both;
  }
  .icons, .icons ul {
    list-style-type: none;
    clear: both;
  }
  .icons > li > ul > li {
    padding: 10px;
    margin-right: 10px;
    float: left;
    border: 1px solid gray;
  }
  .icons > li > ul > li:nth-child(3n+1) > div {
    width: 16px;
    height: 16px;
  }
  .icons > li > ul > li:nth-child(3n+2) > div {
    width: 24px;
    height: 24px;
  }
  .icons > li > ul > li:nth-child(3n+3) > div {
    width: 50px;
    height: 50px;
  }
  .icons > li > ul > li:nth-child(n+4) {
    background-color: #32383f
  }
  svg {
    width: 100%;
    height: 100%;
  }
</style>
</div>
```

#### Icon library

All icons shipped natively with the Portal are available in the SDK, and they are located at [icon](http://localhost:55555/Portal#blade/SamplesExtension/SDKMenuBlade/iconsTheming).

## Theming 

Base colors within the Portal have been outfitted to change based on user-chosen themes. Because the actual hexadecimal values of these colors are determined by the theme definitions, acceptable levels of contrast between elements are maintained by the Framework. The following classes have been made available to extension developers, so that their extensions can react to theme changes and maintain readability.

### Text color classes
```css
// Suited for main text, will render with the highest contrast
msportalfx-text-default

// Suited for labels, subheaders, or any secondary text
msportalfx-text-muted-50

// Suited for links, or call to action text
msportalfx-link-primary

// Suited for highlighting searched text
msportalfx-highlight
```


## Utility classes

There are several built-in classes that make working with the Portal easier.

### Code Formatting

```html
<pre class="msportalfx-code"><code>// this is code</code></pre>
```

In addition to using the `msportalfx-code` class, text blocks may be set to use a monospace style font, as in the following example.

```html
<div class="msportalfx-font-monospace">msportalfx-font-monospace</div>
```

### Classes

The following utility classes standardize basic or initial page formatting.

**msportalfx-boxsizing-borderbox**: Changes layout to include padding and borders in its width and height.

**msportalfx-clearfix**: Applied to a container that contains floated elements. Ensures the container gets a size and that the DOM element following the container flows the document normally with no overlap.

**msportalfx-gridcolumn-asseticon**: Applied as the CSS class name for a grid column that displays an asset SVG icon.

**msportalfx-gridcolumn-statusicon**: Applied as the CSS class name for a grid column that displays a status SVG icon.

**msportalfx-lineheight-reset**: Reset the line height back to the default of the current font size.

**msportalfx-partdivider**: Sets up a horizontal side-to-side divider within the part.

**msportalfx-removeDefaultListStyle**: Remove bullets from a `ul` or `ol` element.

**msportalfx-removeTableBorders**: Removes all borders from a TABLE element.

**msportalfx-removepartpadding**: Remove default padding on a part template.

**msportalfx-removepartpaddingside**: Remove padding on the side only of a part template.


## Color palette

<!-- TODO:  Add a style sheet to this document so that the Framework class behaviors are displayed. -->
The Portal offers a built-in set of classes that are based on a core color palette. These classes ensure a consistent experience for all users. This is especially important when the color conveys meaning, or differentiates data. The purposes are discussed in the following list.

1. [Convey status](#convey-status)

1. [Differentiate data](#differentiate-data)

1. [Color SVG](#color-svg)

### Convey status

CSS classes can be applied to specific UI elements in an extension to convey status. These classes ensure any future changes to the status colors will automatically be applied to the content of the extension. The names of the class prefixes are as follows.

**msportalfx-bg-**: changes the background color.

**msportalfx-text-**: changes the foreground color. The foreground color will be the same for the text and for the border.

**msportalfx-br-**: changes the border color.

**msportalfx-fill-**: changes the SVG fill color.

The classes can be combined to update multiple aspects simultaneously.

In the following example, each class prefix is applied to a box.  The "info" box on the left presents data, and the "dirty" box on the right indicates that the data has been updated.

<div id="statuspalette">
<div class="statuscontainer">
Info
  <div class="msportalfx-bg-info">msportalfx-bg-info</div>
  <div class="msportalfx-text-info">msportalfx-text-info</div>
  <div class="msportalfx-br-info">msportalfx-br-info</div>
  <div class="msportalfx-fill-info">msportalfx-fill-info <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Dirty
  <div class="msportalfx-bg-dirty">msportalfx-bg-dirty</div>
  <div class="msportalfx-text-dirty">msportalfx-text-dirty</div>
  <div class="msportalfx-br-dirty">msportalfx-br-dirty</div>
  <div class="msportalfx-fill-dirty">msportalfx-fill-dirty <svg><rect height="10" width="10"/></svg></div>
</div>
<br>
<br>
<div class="statuscontainer">
Success
  <div class="msportalfx-bg-success">msportalfx-bg-success</div>
  <div class="msportalfx-text-success">msportalfx-text-success</div>
  <div class="msportalfx-br-success">msportalfx-br-success</div>
  <div class="msportalfx-fill-success">msportalfx-fill-success <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Warning
  <div class="msportalfx-bg-warning">msportalfx-bg-warning</div>
  <div class="msportalfx-text-warning">msportalfx-text-warning</div>
  <div class="msportalfx-br-warning">msportalfx-br-warning</div>
  <div class="msportalfx-fill-warning">msportalfx-fill-warning <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Error
  <div class="msportalfx-bg-error">msportalfx-bg-error</div>
  <div class="msportalfx-text-error">msportalfx-text-error</div>
  <div class="msportalfx-br-error">msportalfx-br-error</div>
  <div class="msportalfx-fill-error">msportalfx-fill-error <svg><rect height="10" width="10"/></svg></div>
</div>
</div>

### Differentiate data

Differentiating data with color is a common representation technique, for example, when drawing lines in a chart, or coloring pie chart sections. The following sets of classes are provided to specify background colors for elements. They also define a contrasted color for the text. They do not change appearance between themes.

<div id="bgcolorpalette">
<div class="bgcolorcontainer">
Base set
  <div class="msportalfx-bgcolor-a0">msportalfx-bgcolor-a0</div>
  <div class="msportalfx-bgcolor-b0">msportalfx-bgcolor-b0</div>
  <div class="msportalfx-bgcolor-c0">msportalfx-bgcolor-c0</div>
  <div class="msportalfx-bgcolor-d0">msportalfx-bgcolor-d0</div>
  <div class="msportalfx-bgcolor-e0">msportalfx-bgcolor-e0</div>
  <div class="msportalfx-bgcolor-f0">msportalfx-bgcolor-f0</div>
  <div class="msportalfx-bgcolor-g0">msportalfx-bgcolor-g0</div>
  <div class="msportalfx-bgcolor-h0">msportalfx-bgcolor-h0</div>
  <div class="msportalfx-bgcolor-i0">msportalfx-bgcolor-i0</div>
  <div class="msportalfx-bgcolor-j0">msportalfx-bgcolor-j0</div>
  <div class="msportalfx-bgcolor-k0">msportalfx-bgcolor-k0</div>
</div>
<br>
<br>
<div class="bgcolorcontainer">
Shade 1
  <div class="msportalfx-bgcolor-a1">msportalfx-bgcolor-a1</div>
  <div class="msportalfx-bgcolor-b1">msportalfx-bgcolor-b1</div>
  <div class="msportalfx-bgcolor-c1">msportalfx-bgcolor-c1</div>
  <div class="msportalfx-bgcolor-d1">msportalfx-bgcolor-d1</div>
  <div class="msportalfx-bgcolor-e1">msportalfx-bgcolor-e1</div>
  <div class="msportalfx-bgcolor-f1">msportalfx-bgcolor-f1</div>
  <div class="msportalfx-bgcolor-g1">msportalfx-bgcolor-g1</div>
  <div class="msportalfx-bgcolor-h1">msportalfx-bgcolor-h1</div>
  <div class="msportalfx-bgcolor-i1">msportalfx-bgcolor-i1</div>
  <div class="msportalfx-bgcolor-j1">msportalfx-bgcolor-j1</div>
  <div class="msportalfx-bgcolor-k1">msportalfx-bgcolor-k1</div>
</div>
<div class="bgcolorcontainer">
Shade 2
  <div class="msportalfx-bgcolor-a0s1">msportalfx-bgcolor-a0s1</div>
  <div class="msportalfx-bgcolor-b0s1">msportalfx-bgcolor-b0s1</div>
  <div class="msportalfx-bgcolor-c0s1">msportalfx-bgcolor-c0s1</div>
  <div class="msportalfx-bgcolor-d0s1">msportalfx-bgcolor-d0s1</div>
  <div class="msportalfx-bgcolor-e0s1">msportalfx-bgcolor-e0s1</div>
  <div class="msportalfx-bgcolor-f0s1">msportalfx-bgcolor-f0s1</div>
  <div class="msportalfx-bgcolor-g0s1">msportalfx-bgcolor-g0s1</div>
  <div class="msportalfx-bgcolor-h0s1">msportalfx-bgcolor-h0s1</div>
  <div class="msportalfx-bgcolor-i0s1">msportalfx-bgcolor-i0s1</div>
  <div class="msportalfx-bgcolor-j0s1">msportalfx-bgcolor-j0s1</div>
  <div class="msportalfx-bgcolor-k0s1">msportalfx-bgcolor-k0s1</div>
</div>
<div class="bgcolorcontainer">
Shade 3
  <div class="msportalfx-bgcolor-a0s2">msportalfx-bgcolor-a0s2</div>
  <div class="msportalfx-bgcolor-b0s2">msportalfx-bgcolor-b0s2</div>
  <div class="msportalfx-bgcolor-c0s2">msportalfx-bgcolor-c0s2</div>
  <div class="msportalfx-bgcolor-d0s2">msportalfx-bgcolor-d0s2</div>
  <div class="msportalfx-bgcolor-e0s2">msportalfx-bgcolor-e0s2</div>
  <div class="msportalfx-bgcolor-f0s2">msportalfx-bgcolor-f0s2</div>
  <div class="msportalfx-bgcolor-g0s2">msportalfx-bgcolor-g0s2</div>
  <div class="msportalfx-bgcolor-h0s2">msportalfx-bgcolor-h0s2</div>
  <div class="msportalfx-bgcolor-i0s2">msportalfx-bgcolor-i0s2</div>
  <div class="msportalfx-bgcolor-j0s2">msportalfx-bgcolor-j0s2</div>
  <div class="msportalfx-bgcolor-k0s2">msportalfx-bgcolor-k0s2</div>
</div>
<br>
<br>
<div class="bgcolorcontainer">
Tint 1
  <div class="msportalfx-bgcolor-a2">msportalfx-bgcolor-a2</div>
  <div class="msportalfx-bgcolor-b2">msportalfx-bgcolor-b2</div>
  <div class="msportalfx-bgcolor-c2">msportalfx-bgcolor-c2</div>
  <div class="msportalfx-bgcolor-d2">msportalfx-bgcolor-d2</div>
  <div class="msportalfx-bgcolor-e2">msportalfx-bgcolor-e2</div>
  <div class="msportalfx-bgcolor-f2">msportalfx-bgcolor-f2</div>
  <div class="msportalfx-bgcolor-g2">msportalfx-bgcolor-g2</div>
  <div class="msportalfx-bgcolor-h2">msportalfx-bgcolor-h2</div>
  <div class="msportalfx-bgcolor-i2">msportalfx-bgcolor-i2</div>
  <div class="msportalfx-bgcolor-j2">msportalfx-bgcolor-j2</div>
  <div class="msportalfx-bgcolor-k2">msportalfx-bgcolor-k2</div>
</div>
<div class="bgcolorcontainer">
Tint 2
  <div class="msportalfx-bgcolor-a0t1">msportalfx-bgcolor-a0t1</div>
  <div class="msportalfx-bgcolor-b0t1">msportalfx-bgcolor-b0t1</div>
  <div class="msportalfx-bgcolor-c0t1">msportalfx-bgcolor-c0t1</div>
  <div class="msportalfx-bgcolor-d0t1">msportalfx-bgcolor-d0t1</div>
  <div class="msportalfx-bgcolor-e0t1">msportalfx-bgcolor-e0t1</div>
  <div class="msportalfx-bgcolor-f0t1">msportalfx-bgcolor-f0t1</div>
  <div class="msportalfx-bgcolor-g0t1">msportalfx-bgcolor-g0t1</div>
  <div class="msportalfx-bgcolor-h0t1">msportalfx-bgcolor-h0t1</div>
  <div class="msportalfx-bgcolor-i0t1">msportalfx-bgcolor-i0t1</div>
  <div class="msportalfx-bgcolor-j0t1">msportalfx-bgcolor-j0t1</div>
  <div class="msportalfx-bgcolor-k0t1">msportalfx-bgcolor-k0t1</div>
</div>
<div class="bgcolorcontainer">
Tint 3
  <div class="msportalfx-bgcolor-a0t2">msportalfx-bgcolor-a0t2</div>
  <div class="msportalfx-bgcolor-b0t2">msportalfx-bgcolor-b0t2</div>
  <div class="msportalfx-bgcolor-c0t2">msportalfx-bgcolor-c0t2</div>
  <div class="msportalfx-bgcolor-d0t2">msportalfx-bgcolor-d0t2</div>
  <div class="msportalfx-bgcolor-e0t2">msportalfx-bgcolor-e0t2</div>
  <div class="msportalfx-bgcolor-f0t2">msportalfx-bgcolor-f0t2</div>
  <div class="msportalfx-bgcolor-g0t2">msportalfx-bgcolor-g0t2</div>
  <div class="msportalfx-bgcolor-h0t2">msportalfx-bgcolor-h0t2</div>
  <div class="msportalfx-bgcolor-i0t2">msportalfx-bgcolor-i0t2</div>
  <div class="msportalfx-bgcolor-j0t2">msportalfx-bgcolor-j0t2</div>
  <div class="msportalfx-bgcolor-k0t2">msportalfx-bgcolor-k0t2</div>
</div>
</div>

### Color SVG

Certain types of custom SVG content should adhere to the color palette. This is mostly for custom controls that use color to differentiate data, like charts. Iconography does not have this requirement, and instead you should refer to the [Icons](portalfx-icons.md) documentation to color those.

To use the palette within SVG content, use the same class names as the one for [data differentiation](#differentiate-data). The classes affect both the "`stroke`" and "`fill`" properties. The CSS rules assume the target element is within an "`g`" element contained in an "`svg`" element. The following sample shows proper usage:

```html
    <svg>
        <g>
            <rect class="msportafx-bgcolor-i0t2"/>
        </g>
    </svg>
```

```cs
<style type="text/css">
  #statuspalette .statuscontainer {
    display: inline-flex;
    flex-flow: column nowrap;
  }

  .statuscontainer div {
    padding: 10px;
    width: 200px;
    display: inline-block;
    text-align: center;
    margin: 3px auto;
    border-width: 3px;
    border-style: solid;
  }

  #statuspalette svg {
    height: 10px;
    width: 10px;
    display: inline-block;
    stroke: #000;
  }

  /* These style copied from generated Theme.Universal.css */
  .msportalfx-bg-info {
    background-color: #0072c6;
  }
  .msportalfx-bg-success {
    background-color: #7fba00;
  }
  .msportalfx-bg-dirty {
    background-color: #9b4f96;
  }
  .msportalfx-bg-error {
    background-color: #e81123;
  }
  .msportalfx-bg-warning {
    background-color: #ff8c00;
  }
  .msportalfx-text-info {
    color: #0072c6;
  }
  .msportalfx-text-success {
    color: #7fba00;
  }
  .msportalfx-text-dirty {
    color: #9b4f96;
  }
  .msportalfx-text-error {
    color: #e81123;
  }
  .msportalfx-text-warning {
    color: #ff8c00;
  }
  .msportalfx-br-info {
    border-color: #0072c6;
  }
  .msportalfx-br-success {
    border-color: #7fba00;
  }
  .msportalfx-br-dirty {
    border-color: #9b4f96;
  }
  .msportalfx-br-error {
    border-color: #e81123;
  }
  .msportalfx-br-warning {
    border-color: #ff8c00;
  }
  .msportalfx-fill-info {
    fill: #0072c6;
  }
  .msportalfx-fill-success {
    fill: #7fba00;
  }
  .msportalfx-fill-dirty {
    fill: #9b4f96;
  }
  .msportalfx-fill-error {
    fill: #e81123;
  }
  .msportalfx-fill-warning {
    fill: #ff8c00;
  }
</style>

<style type="text/css">
  #bgcolorpalette .bgcolorcontainer {
    display: inline-flex;
    flex-flow: column nowrap;
  }

  .bgcolorcontainer div {
    padding: 10px;
    width: 200px;
    display: inline-block;
    text-align: center;
    margin: auto;
  }

  /* These style copied from generated CustomPart.css */
  .msportalfx-bgcolor-a1 {
    background-color: #fcd116;
    color: #000000;
  }
  .msportalfx-bgcolor-b1 {
    background-color: #eb3c00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c1 {
    background-color: #ba141a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d1 {
    background-color: #b4009e;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e1 {
    background-color: #442359;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f1 {
    background-color: #002050;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g1 {
    background-color: #0072c6;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h1 {
    background-color: #008272;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i1 {
    background-color: #007233;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j1 {
    background-color: #7fba00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k1 {
    background-color: #a0a5a8;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0 {
    background-color: #fff100;
    color: #000000;
  }
  .msportalfx-bgcolor-b0 {
    background-color: #ff8c00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0 {
    background-color: #e81123;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0 {
    background-color: #ec008c;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0 {
    background-color: #68217a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0 {
    background-color: #00188f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0 {
    background-color: #00bcf2;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0 {
    background-color: #00b294;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0 {
    background-color: #009e49;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0 {
    background-color: #bad80a;
    color: #000000;
  }
  .msportalfx-bgcolor-k0 {
    background-color: #bbc2ca;
    color: #000000;
  }
  .msportalfx-bgcolor-a2 {
    background-color: #fffc9e;
    color: #000000;
  }
  .msportalfx-bgcolor-b2 {
    background-color: #ffb900;
    color: #000000;
  }
  .msportalfx-bgcolor-c2 {
    background-color: #dd5900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d2 {
    background-color: #f472d0;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e2 {
    background-color: #9b4f96;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f2 {
    background-color: #4668c5;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g2 {
    background-color: #6dc2e9;
    color: #000000;
  }
  .msportalfx-bgcolor-h2 {
    background-color: #00d8cc;
    color: #000000;
  }
  .msportalfx-bgcolor-i2 {
    background-color: #55d455;
    color: #000000;
  }
  .msportalfx-bgcolor-j2 {
    background-color: #e2e584;
    color: #000000;
  }
  .msportalfx-bgcolor-k2 {
    background-color: #d6d7d8;
    color: #000000;
  }
  .msportalfx-bgcolor-a0s2 {
    background-color: #807900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-b0s2 {
    background-color: #804600;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0s2 {
    background-color: #740912;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0s2 {
    background-color: #760046;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0s2 {
    background-color: #34113d;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0s2 {
    background-color: #000c48;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0s2 {
    background-color: #005e79;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0s2 {
    background-color: #084c41;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0s2 {
    background-color: #063d20;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0s2 {
    background-color: #3d460a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k0s2 {
    background-color: #32383f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0s1 {
    background-color: #bfb500;
    color: #000000;
  }
  .msportalfx-bgcolor-b0s1 {
    background-color: #bf6900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0s1 {
    background-color: #ae0d1a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0s1 {
    background-color: #b10069;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0s1 {
    background-color: #4e195c;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0s1 {
    background-color: #00126b;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0s1 {
    background-color: #008db5;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0s1 {
    background-color: #00856f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0s1 {
    background-color: #0f5b2f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0s1 {
    background-color: #8ba208;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k0s1 {
    background-color: #464f59;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0t1 {
    background-color: #fcf37e;
    color: #000000;
  }
  .msportalfx-bgcolor-b0t1 {
    background-color: #ffba66;
    color: #000000;
  }
  .msportalfx-bgcolor-c0t1 {
    background-color: #f1707b;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0t1 {
    background-color: #f466ba;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0t1 {
    background-color: #a47aaf;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0t1 {
    background-color: #6674bc;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0t1 {
    background-color: #66d7f7;
    color: #000000;
  }
  .msportalfx-bgcolor-h0t1 {
    background-color: #66d1bf;
    color: #000000;
  }
  .msportalfx-bgcolor-i0t1 {
    background-color: #66c592;
    color: #000000;
  }
  .msportalfx-bgcolor-j0t1 {
    background-color: #d6e86c;
    color: #000000;
  }
  .msportalfx-bgcolor-k0t1 {
    background-color: #8f9ca8;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0t2 {
    background-color: #fffccc;
    color: #000000;
  }
  .msportalfx-bgcolor-b0t2 {
    background-color: #ffe8cc;
    color: #000000;
  }
  .msportalfx-bgcolor-c0t2 {
    background-color: #facfd3;
    color: #000000;
  }
  .msportalfx-bgcolor-d0t2 {
    background-color: #fbcce8;
    color: #000000;
  }
  .msportalfx-bgcolor-e0t2 {
    background-color: #e1d3e4;
    color: #000000;
  }
  .msportalfx-bgcolor-f0t2 {
    background-color: #ccd1e9;
    color: #000000;
  }
  .msportalfx-bgcolor-g0t2 {
    background-color: #ccf2fc;
    color: #000000;
  }
  .msportalfx-bgcolor-h0t2 {
    background-color: #ccf0ea;
    color: #000000;
  }
  .msportalfx-bgcolor-i0t2 {
    background-color: #ccecdb;
    color: #000000;
  }
  .msportalfx-bgcolor-j0t2 {
    background-color: #f0f7b2;
    color: #000000;
  }
  .msportalfx-bgcolor-k0t2 {
    background-color: #63707e;
    color: #ffffff;
  }
</style>
```


<!--
 gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-style-guide.md"}
-->

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-icons.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-icons.md"}
