
## Overview

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