# Responsive design
Here are some guidelines for making your experience look good at all resolutions.

## Context
When we say responsive design, it’s shorthand for an Azure layout that responds dynamically to different browser window sizes or thresholds.

Template blades allow extensions to define their design with almost all of the same flexibility and responsiveness of a traditional website. We do NOT mean “responsiveness” as it relates to mobile devices. Azure remains a rich desktop experience and is still optimized for use on laptop screens and monitors.

## Problem
Without the proper settings in place, content will stretch infinitely on large screens.

## Solution
There are a few quick fixes you can make to set minimum and maximum widths for your UI elements.

### Also known as
- Min width
- Max width

## Examples

### Example images


### Example uses

## Use when
All Azure experiences should should consider responsive design with set minimum and maximum content widths.

## Anatomy

## Behavior
Here are the minumum and maximum widths for common portal components.

### Text boxes
Min width: 75px
Max width: 265px

### Dropdowns and combo boxes
Min width: 75px
Max width: 265px

### Lines of text (Not in a control)
Max width: 700px

### Editable grid text boxes
Min width: 80px
Max width: 265px 

### Entire page
Max width: 700px


## Success critera
- Blades look and feel professional regardless of screen resolution
- Content adapts to make use of the space available to full screen blades on large screens
- Functions well at common laptop resolutions (including Retina-type screens that run at 200% magnification by default)
- Does not allow content to stretch infinitely on large screens.

## Do
-Test your implementation at multiple window sizes and blade configurations. Make sure you've checked both min and max column widths
-For dopdowns, make sure list items aren’t wider than the text field. If an item's too long, it can be truncated and hard to read.

## Don't 

## Related design guidelines
<!-- Links to Related design guidelines.  Always include the link to the readme -->
* Design guidelines [top-design.md](top-design.md)
* Full screen [design-patterns-page-fullscreen.md](design-patterns-page-fullscreen.md)

## Research and usability
Research often finds issues with experiences that do not follow guidelines on page and field maximum widths.

* Consider reducing the horizontal width of the form field. - [The ellipsis was not a clear call to action.](https://hits.microsoft.com/Insight/1079450)

## Telemetry
<!-- Links to portal telemetry showing the solution usage -->

* Full screen status of pages with more than 20,000 views over last 28 days [View report](https://aka.ms/portalfx/fundamentals/nonfullscreenblades)

# For developers
Developers can use the following information to get started implementing this pattern

## Tips and tricks
<!-- Bulleted list of tips and tricks for developers -->
-Set a max-width on your content in the CSS (blade/part templates).

## Related documentation
<!-- Links to related developer docs -->
