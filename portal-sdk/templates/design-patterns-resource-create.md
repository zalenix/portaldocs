# Resource Create 
The resource create pattern provides a simple, intuitive and quick experience for creating resources.

# Context
Users need to create Azure resources.

# Problem
Creating a resource in Azure can vary from a simple experience with a few required fields to a complex one with many fields, concepts and related resources.

# Solution
The resource create pattern enables quick configuration of a new resource by using a minimum number of fields and providing default values. The pattern also enables users to walk through detailed configuration options in order to manually set many resource options.  The experience uses a fullscreen page with tabs to separate related configuration steps and guide the user during the create process.

## Also known as 

- Full screen create
- Tabbed create  

# Examples 

## Example image
<div style="max-width:800px">
<img alttext="Resource create example" src="../media/designpatterns-resource-create/Resource-create-1.png"  />
</div>

## Example uses
These Azure resources are good examples of this design pattern 

* [Free account virtual machine](https://rc.portal.azure.com/#create/microsoft.freeaccountvirtualmachine)
* [IoT hub](https://rc.portal.azure.com/#create/Microsoft.IotHub)
* [Kubernetes service](https://rc.portal.azure.com/#create/microsoft.aks)

# Use when
Creating a resource in Azure

## Anatomy  
<div style="max-width:800px">
<img alttext="Resource create anatomy" src="../media/designpatterns-resource-create/resource-create-anatomy.png"  />
</div>

The resource create experience contains:
1. Tabs with descriptive text and learn more links to switch between logical input steps
2. Input fields divided into logical sections with concise, instructional text for each section
3. Footer navigation with buttons to navigate to previous and next tabs and submit the form

### Design Principles

Follow these recommendations when designing your Create form:

1. Single, full screen blade.
2. Logical steps provided by the existing `Tabs` control.
3. Easily and freely navigate between tabs.
4. Include descriptive and supportive text.
5. Ability to quickly deploy resources with minimal input.

### Navigation

Use the tabs & sections to organize content. The `Basics` tab should be the starting point for all creates and contain essential configuration info. The design should allow for quick resource creation at any time with unrestricted navigation between tabs. Enabling users to freely navigate the tabs reduces the friction for users looking to learn about your resource.  The combination of quick creates and tab exploration can lead to additional resource deployments over time.

![alt-text](../media/top-extensions-create/Tabs.png "Create experience with Tabs")

## Behavior 

### Tabs
Tabs group sections of the create experience into manageable categories. Tabs can also be used to separate required information from optional information for simpler configuration.

Most creates should have a minimum of 3 tabs; `Basics`, `Tags`, `Review + create`.  All other tabs are optional.  Tab naming should follow sentence case, with only the first letter capitalized unless the words are proper nouns, acronyms or brand names.

<div style="max-width:800px">
<img alttext="Tabs" src="../media/designpatterns-resource-create/Tabs.png"  />
</div>

#### Basics
The first tab contains fields required for creating the resource. Set default values when possible to eliminate additional time spent on create.

The `Basics` tab should contain the typical fields for Azure resources
* Project Details - Groups the `Subscription` and `Resource Group` controls.  The default text for Project Details is `Select the subscription to manage deployed resources and costs. Use resource groups like folders to organize and manage all your resources.`
* `Name` - the name of the resource
* `Region` - used to be referred to as Location
* SKU/Cost/Pricing tier - enable the user to control the cost of the resource

#### Optional tabs
Additional tabs are used to organize optional settings specific to your resource.  Tabs should have short names, typically a noun. Tab naming should follow sentence case, with only the first letter capitalized unless the words are proper nouns, acronyms or brand names.

#### Tags
Many enterprises are starting to create subscription and resource group polices that require tagging resources at create time.  Not including the `Tags` tab will block those users from deploying resources using the portal.  The `Tags` tab contains the tags control, which allows users to assign key value pairs to the selected Resource Types.	

![alt-text](../media/top-extensions-create/Tags.png "Tags control")

#### Review + Create
Allowing the user to verify all settings prior to submission ensures accuracy and reduces the need for user redeployments.  Use the summary control to help organize content from multiple tabs.  Disable the create button until validation succeeds.

![alt-text](../media/top-extensions-create/Review.png "Review + Create")

### Tab Layout

**Descriptions**: The top of each tab should include a brief description about the content to follow. When possible include `Learn more` links to relevant docs.

**Section Headers**: Used to separate common settings within a tab including a description for the section.

**Alignment**: Stack labels above controls if the screen resolution < 700px.
	
**Info Bubbles**: If you have input fields that may not be immediately familiar to users, include an info bubble that shows more information.

### Sections that group input fields
When creating a form that includes several fields pertaining to a certain subject, you can group them into a section with a header that gives the user a clear indication of what they’re being asked for. You can also add explanatory text just below the group header if the task may not be immediately clear to the user.
Section headers should follow sentence case, with only the first letter capitalized unless the words are proper nouns, acronyms or brand names.
<div style="max-width:800px">
<img alttext="Tabs" src="../media/designpatterns-resource-create/Grouped-input-fields.png" />
</div>

### Sub create in a context pane
Context panes can be used for sub creates within the create flow. The sub create allows users to configure services or to create resources that are related to the main resource that's being created, without losing the overall context.
<div style="max-width:800px">
<img alttext="Tabs" src="../media/designpatterns-resource-create/subcreate.png"  />
</div>

### Footer navigation
The footer nav contains the call to action (CTA) for creating the resource, as well as two buttons used for navigating between tabs. If your resource supports created templates, you can include an affordance for that in the footer nav.

## Post create
The post create page provides realtime deployment status, help with troubleshooting, and improved error display. Best practice is to include additional information here to help the user learn more about the resource being created, as well as related Azure resources.
<div style="max-width:800px">
<img alttext="Tabs" src="../media/designpatterns-resource-create/post-create.png"  />
</div>

## Do 
-   Do put all the required fields on the first tab so the user has the option to quickly create your resource

-   Mark required fields with the red asterisk

 - Include info bubbles if there are input fields that may not be
   immediately familiar

## Don't 
-   When moving your resource to full screen, don’t just map your existing create experience to separate tabs.

-   Don't include lengthy and unclear explanatory text. It should be used to clarify and set expectations in a few short sentences

# Related design patterns

-   Forms [designpatterns-page-forms.md](designpatterns--page-forms.md)
-   Full screen [designpatterns-page-fullscreen.md](designpatterns--page-fullscreen.md)
-   Resource Browse [designpatterns-resource-browse.md](designpatterns-resource-browse.md)
-   Resource Manage [designpatterns-resource-manage.md](designpatterns-resource-manage.md)
-   Design patterns [top-design.md](top-design.md)

# Research and usability 

# Telemetry

# For developers 
Developers can use the following information to get started implementing this pattern

## Tips and tricks 

-   Set a maximimum width of 600px for the tab content area that contains input fields
-   Screen resolution - If screen resolution is less than 700px, set left aligned = false
-   To include the visual connector between Subscription and RG, set `Nested = True` on the RG control.  

## Related documentation

-   Resource Create [top-extensions-create.md](./top-extensions-create.md)




