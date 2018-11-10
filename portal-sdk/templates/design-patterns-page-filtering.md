<!-- This is the template to use when creating a new design pattern document -->
# Page Filtering
<!-- Fill in the name above and then write a short description of the design pattern.  For example
"Forms are the manner in which we gather and validate user input."
-->
Filtering enables users to quickly winnow down a list to the result set they are seeking.

# Context
<!-- Short description of the context.  For example, "Users input information when managing Azure resources." -->
Azure shows lists of resources and graphical representations of data that must allow users to focus on a subset of information

# Problem
<!-- Short description of the problem.  For example, 
"Users need to input information to create, deploy and configure resources."
-->
Users have a lot of resources in Azure and often need to focus on a subset.

# Solution
<!-- Short description of the solution For example 
"The portal offers several input methods with consistent field and form validation to ensure users can easily input information and understand whether that info is valid.  " 
-->
The portal enables users to add, remove and customize filters on pages so that users can see exactly what they want.

## Also known as
<!-- Bulleted list of other terms used to describe the solution, if any -->

# Examples

## Example images
<!-- Include example image of the solution in the portal -->
Dashboard
<div style="max-width:800px">
<img alttext="Full time range" src="../media/design-patterns-page-filtering/dashboard.PNG"  />
</div>

Activity log
<div style="max-width:800px">
<img alttext="Time range" src="../media/design-patterns-page-filtering/activity-log.png"  />
</div>

## Example uses
<!-- Descriptions and ideally deep links into the portal for running examples -->

* `Dashboard` 
* `All resources`
* `Activity logs`
* `Metrics`  

# Use when
<!-- Description of when to use this solution.  For example "User is creating a resource" -->

## Anatomy
<!-- Image demonstrating the solution with numerical callouts to the solution components.
     Bulleted list of the callouts with explanations of each
-->

## Behavior
<!-- Description of overall behavior -->

### Time range filtering

If users would benefit from increased filtering functionality, you can inciude additional time range values and add specify the time zone
<div style="max-width:800px">
<img alttext="Full time range" src="../media/design-patterns-page-filtering/filter-time-range-1.PNG"  />
</div>

If additional options won't add value to the scenario, keep it clean and simple. 
<div style="max-width:800px">
<img alttext="Time range" src="../media/design-patterns-page-filtering/filter-time-range-2.PNG"  />
</div>

## Do
<!-- Bulleted list of reminders for best practices-->

## Don't 
<!-- Bulleted list of things to avoid -->

# Related design patterns
<!-- Links to related design patterns.  Always include the link to the readme -->
* Design patterns [top-design.md](top-design.md)

# Research and usability
<!-- Links to the research for the solution -->

# Telemetry
<!-- Links to portal telemetry showing the solution usage -->

# For developers
Developers can use the following information to get started implementing this pattern

## Tips and tricks
<!-- Bulleted list of tips and tricks for developers -->

## Related documentation
<!-- Links to related developer docs -->
