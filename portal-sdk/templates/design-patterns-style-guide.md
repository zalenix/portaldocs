# Style guide

The Azure portal has 4 themes, a color pallette and type ramp that resonate with customers and meets accessibility requirements.


## Key style items
* Segoe UI is the standard typeface of the Azure portal
* Use sentence case for headers and labels. DO NOT USE ALL UPPERCASE, IT IS HARD TO READ
* Use 13px as body-text size
* Wrap text at 75 characters per line
* All the line style icons align with the monoline icon style from Full MDL Icon font.
* We use 4 px grid system. The smallest padding/margin is 4 px. 


### External link
Links that open in new browser instances should follow this styling

<div style="max-width:600px">
<img alttext="external link" src="../media/design-patterns-style-guide/external-link.jpg"  />
</div>

## Full style guide
* Full Style guide [Azure Portal Style Guide PDF](../media/design-patterns-style-guide/Azure-Portal-Style-Guide.pdf)

# Screen resolutions
Ensure that your designs work well at all P0 resolutions.  Based on telemetry data \(see below\), resolution priorities are:

* P0 - experience needs to be great
    * 1366 - portal team uses 1366 x 786 as a baseline.  This is often the resolutions at events (Ignite, Build, etc)
    * 1920 
* P1 - experience needs to work
    * \>1920 
* P3 – experience needs to work
    * 1024


Designing at 1366 force a focus on the most important information. When designing initially for larger sizes, there is a tendency to push more features and functionality onto the screen.  Designs scales up to a larger resolution more easily than a design for larger resolutions like 1920 can scale down to 1366 in terms of data density etc.

1366 x768 (or 1280 x 720) are still the resolutions used at events, so we want to ensure everything looks great at 1366. 


### Telemetry
Reports showing portal usage
[Screen resolution telemetry](https://msit.powerbi.com/groups/me/dashboards/7b218d20-f0aa-4858-b0f9-567386a0ac1c)


## Related design guidelines
* Design guidelines [top-design.md](top-design.md)


# For developers 
Developers can use the following information to get started implementing this pattern

## Related documents
The portal includes a built in list of CSS classes that may be used inside of your templates.
* Style for extensions [portalfx-extensions-style.md](portalfx-extensions-style.md)
