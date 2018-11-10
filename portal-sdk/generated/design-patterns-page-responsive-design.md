<a name="responsive-design"></a>
# Responsive design
Here are some guidelines for making your experience look good at all resolutions.

<a name="context"></a>
# Context
When we say responsive design, it’s shorthand for an Azure layout that responds dynamically to different browser window sizes or thresholds.

Template blades allow extensions to define their design with almost all of the same flexibility and responsiveness of a traditional website. We do NOT mean “responsiveness” as it relates to mobile devices. Azure remains a rich desktop experience and is still optimized for use on laptop screens and monitors.

<a name="problem"></a>
# Problem
Without the proper settings in place, content will stretch infinitely on large screens.

<a name="solution"></a>
# Solution
There are a few quick fixes you can make to set minimum and maximum widths for your UI elements.

<a name="solution-also-known-as"></a>
## Also known as
- Min width
- Max width

<a name="examples"></a>
# Examples

<a name="examples-example-images"></a>
## Example images


<a name="examples-example-uses"></a>
## Example uses

<a name="use-when"></a>
# Use when
All Azure experiences should should consider responsive design with set minimum and maximum content widths.

<a name="use-when-anatomy"></a>
## Anatomy

<a name="use-when-behavior"></a>
## Behavior
Here are the minumum and maximum widths for common portal components.

<a name="use-when-behavior-text-boxes"></a>
### Text boxes
Min width: 75px
Max width: 265px

<a name="use-when-behavior-dropdowns-and-combo-boxes"></a>
### Dropdowns and combo boxes
Min width: 75px
Max width: 265px

<a name="use-when-behavior-lines-of-text-not-in-a-control"></a>
### Lines of text (Not in a control)
Max width: 700px

<a name="use-when-behavior-editable-grid-text-boxes"></a>
### Editable grid text boxes
Min width: 80px
<div style="max-width:800px">
<img alttext="Example image" src="../media/design-patterns-responsive-design/editable-grid-min-width.png"  />
</div>

Max width: 265px 
This example has slightly narrower text boxes at 220px
<div style="max-width:800px">
<img alttext="Example image" src="../media/design-patterns-responsive-design/editable-grid-max-width.png"  />
</div>

<a name="use-when-success-critera"></a>
## Success critera
- Blades look and feel professional regardless of screen resolution
- Content adapts to make use of the space available to full screen blades on large screens
- Functions well at common laptop resolutions (including Retina-type screens that run at 200% magnification by default)
- Does not allow content to stretch infinitely on large screens.

<a name="use-when-do"></a>
## Do
-Test your implementation at multiple window sizes and blade configurations. Make sure you've checked both min and max column widths
-For dopdowns, make sure list items aren’t wider than the text field. If an item's too long, it can be truncated and hard to read.

<a name="use-when-don-t"></a>
## Don&#39;t

<a name="related-design-patterns"></a>
# Related design patterns
<!-- Links to related design patterns.  Always include the link to the readme -->
* Design patterns [top-design.md](top-design.md)

<a name="research-and-usability"></a>
# Research and usability
<!-- Links to the research for the solution -->

<a name="telemetry"></a>
# Telemetry
<!-- Links to portal telemetry showing the solution usage -->

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks
<!-- Bulleted list of tips and tricks for developers -->
-Set a max-width on your content in the CSS (blade/part templates) OR set initial DisplayState=“normal” in a blade’s PDL.

<a name="for-developers-related-documentation"></a>
## Related documentation
<!-- Links to related developer docs -->
