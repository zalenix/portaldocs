
# Accessibility

Accessibility is about making the Portal usable by people who have limitations that prevent or impede the use of conventional user interfaces. For some situations, accessibility requirements are imposed by law. However, Microsoft requires all blocking accessibility issues to be addressed regardless of legal requirements so the Portal caters to the largest possible audience. The Framework team has taken an inclusive design approach in incorporating keyboard, programmatic, and visual design support throughout the Portal. Extensions are responsible for any graphics, styling, and custom HTML templates they provide.

## What the framework provides

1. The Framework provides reusable tiles, parts, forms, and controls that are fully accessible. 

    Using the Form creation helper, your form will be fully accessible.

    * All Portal:
      * Chrome
      * Panes
      * Sidebar
      * Top nav
      * Context menus
      * Widgets

    * Keyboard shortcuts are provided and are listed within the Help Menu in the Portal. The shortcuts must work when using your extension content.

    * A fully accessible default theme (Blue)

      **NOTE**: When using that theme, the contrast ratio for all text must meet the AAA guidelines that are located at [http://www.interactiveaccessibility.com/web-accessibility-guidelines](http://www.interactiveaccessibility.com/web-accessibility-guidelines).

    * The Portal supports `HighContrast` mode and should display controls and chrome accordingly.

1. Focus management is handled by the Framework and follows those rules, unless the focus is changed by the user first.

* Focus moves to newly opened blade in the content section

* Focus moves to context pane when opened

* Focus should move freely across all elements visible in the Portal, except in the following cases:

    * `ContextMenu` captures focus in a loop
    * `DropMenu` captures focus in a loop

**NOTE**: Currently, the focus is on the first focusable element.

## Accessibility Checklist 

<!--TODO: Determine what all of the accessiblity rules are, and associate them to the tagging rules for bugs -->
There are items for accessbility whose absence may result in bugs for the Framework team.  In an effort to reduce the number of bugs, some guidelines are listed below.

1. Extensions should update to SDK version 788 or more recent.
 
1. Extension should update to use supported controls.  A sample of controls is located at [https://df.onecloud.azure-test.net/#blade/SamplesExtension/SDKMenuBlade/controls](https://df.onecloud.azure-test.net/#blade/SamplesExtension/SDKMenuBlade/controls). 

    **NOTE**: `DiffEditor`, `DatePolyFills`, and `PairedTimeline` are not supported by Framework.	

1. Extension should ensure theming support in both Light and Dark mode when using custom colors

1. Extension should not interfere with High Contrast theming.  A common mistake is to use a  `<div>` element instead of an `<a>` element for a link.

1. When introducing user-actionable areas that are not based on supported controls, extension should use `fxClick` as documented. `click` binding is not supported.

1. Extensions that create custom implementation of supported controls should be identified.

1. Images and logos that are part of the Narrator Items mode should be labelled properly, or marked as aria-hidden if not significant.

1. Review all controls and ensure that labels are being used. If labels are omitted, then use aria labels in the `ViewModel`.

**NOTE**: The aria-label is one tool used by assistive technologies like screen readers. However, it is not natively supported on browsers and has no effect on them. It will not be of use to the population that is served by WCAG, except screen reader users. 

1. Verify keyboard accessibility of your blade content and forms. Navigate to your content in the Portal and ensure focus is captured to your content in the expected way. Autofocus on open provided by the framework. 

1. Screen items  have titles that are displayed on hover. If text or labels are missing from the screen, use the  `TITLE` attribute  to display them.  If the `TITLE` attribute cannot display the information,  use aria-label.  For more information about HTML attributes, see [http://www.w3schools.com/html/html_attributes.asp](http://www.w3schools.com/html/html_attributes.asp).

1. Screen contrast has a minimum value. If the contrast is too low, use the WCAG color contrast tool that is located at [http://leaverou.github.io/contrast-ratio/](http://leaverou.github.io/contrast-ratio/) to adjust colors.

## Testing for accessibility 

When testing the extensions, a report that is created after testing is made available to the developer of the extension.

<!--TODO: Determine what "justifications" means.  Why the pattern is applicable to this specific extension? -->

* Ibiza provides a list of common pattern that are not issues, with justifications

* Ibiza provides a list of external product bugs that are not issues to fix with justifications and bug links

### High-contrast

Windows High Contrast Mode (WHCM) has native support for **Internet Explorer** and **Edge**. Other browsers do not support WHCM natively, and neither do other operating systems, therefore a custom theme is provided in the settings pane of the Portal. 

**NOTE**: The custom theme is a good approximation of WHCM behavior and can be used to quickly verify compliance. To properly verify, use High Contrast settings option 2 with Edge.

### Screen reader

Either a combination of **NVDA**/**Firefox** or **Narrator**/**Edge** should satisfy screen reader requirements.

**NOTE**: At this time, Chrome seems to ignore some aria properties and the native widgets are not all properly accessible.

### Accessibility test engines 

The following Websites provide accessibility test engines.

| Name    | Purpose | Website |
| ------- | ------- |  ------ |
| aXe: the Accessibility Engine| An open source rules library for accessibility testing        |  [http://www.deque.com/products/axe/](http://www.deque.com/products/axe/) |
| Accessibility testing in Chrome Developer Tools |    Chrome plugin    |  [http://bitly.com/aXe-Chrome](http://bitly.com/aXe-Chrome) |
|     aXe Developer Tools     |  Firefox plugin | [http://bit.ly/aXe-Firefox](http://bit.ly/aXe-Firefox) |
|    Accessibility engine for automated Web UI testing   |  axe-core  (unit testing)  |[https://github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core) |

## Troubleshooting issues

After developing and testing an extension for accessibility, if there are still issues, they may be known by the Framework team.  Review the site located at [http://vstfrd:8080/Azure/RD/_workitems#path=Shared+Queries%2FAUX%2FIbiza%2FAccessibility%2FIbiza+Accessibility+-+Triaged+Active&_a=query](http://vstfrd:8080/Azure/RD/_workitems#path=Shared+Queries%2FAUX%2FIbiza%2FAccessibility%2FIbiza+Accessibility+-+Triaged+Active&_a=query)  to determine whether there are any known issues.   If this is a new issue, you can file a Framework bug by using the site located at  [http://aka.ms/portalfx/accessibility/bug](http://aka.ms/portalfx/accessibility/bug) on controls owned by the Framework.

{"gitdown": "include-file", "file": "../templates/portalfx-accessibility-planning.md"}

## For more information 

For more information about developing extensions with accessibility, see the following publications.

Trusted Tester with Keros (internal only)
[https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Trusted_Tester.3F](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Trusted_Tester.3F)

What is Keros? (internal only) Baseline accessibility assessment (internal only)
[https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Keros.3F](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Keros.3F)

Full MAS compliance assessment (internal only)
[https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#Full_MAS_compliance_assessment](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#Full_MAS_compliance_assessment)

WCAG color contrast tool
[http://leaverou.github.io/contrast-ratio/](http://leaverou.github.io/contrast-ratio/)

WebAIM Accessibility
[http://webaim.org/articles/](http://webaim.org/articles/)

AAA guidelines
[http://www.interactiveaccessibility.com/web-accessibility-guidelines](http://www.interactiveaccessibility.com/web-accessibility-guidelines)

Natural tab order
[https://www.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/](https://www.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/)

Web semantics
[http://www.w3schools.com/html/html5_semantic_elements.asp](http://www.w3schools.com/html/html5_semantic_elements.asp)

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-bp-accessibility.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-accessibility.md"}
