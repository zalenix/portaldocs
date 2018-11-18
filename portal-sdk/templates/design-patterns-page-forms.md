# Forms
Forms are the manner in which we gather and validate user input.

## Context
Users enter information to manage Azure resources.

## Problem
Users need to enter information to create, configure and manage resources.  Users file support tickets and provide feedback by entering information in the portal.

## Solution
The portal offers several variations of forms with consistent field layout and form validation to ensure users can easily enter information and understand whether that info is valid.  The form variations are `dialogs`, `context panes`, `full screen blades` and `wizards`.  Well designed forms enable users to increase the speed and accuracy of input and lead to successful form completion.

### Also known as

## Examples

### Example images

### Dialog
<div style="max-width:800px">
<img alttext="Forms example - dialog" src="../media/design-patterns-page-forms/forms-dialog.png"  />
</div>

### Context Pane - narrow
<div style="max-width:800px">
<img alttext="Forms example - narrow context pane" src="../media/design-patterns-page-forms/forms-context-pane-narrow.png"  />
</div>

### Context Pane - wide
<div style="max-width:800px">
<img alttext="Forms example - wide context pane" src="../media/design-patterns-page-forms/forms-context-pane.png"  />
</div>

### Full screen blade
<div style="max-width:800px">
<img alttext="Forms example - full screen blade" src="../media/design-patterns-page-forms/forms-full-screen-blade.png"  />
</div>

### Full screen blade from resource menu
<div style="max-width:800px">
<img alttext="Forms example - full screen blade from resource menu" src="../media/design-patterns-page-forms/forms-full-screen-blade-from-menu.png"  />
</div>

### Wizard
<div style="max-width:800px">
<img alttext="Forms example" src="../media/design-patterns-page-forms/forms.png"  />
</div>

### Example uses
* Stopping a VM - dialog 
* Tagging a VM - context pane
* Moving a VM to a different resource group - full screen blade
* Editing VM diagnostic settings - full screen blade from resource menu
* Creating a VM - wizard [Free account virtual machine](https://rc.portal.azure.com/#create/microsoft.freeaccountvirtualmachine)

## Use when
Choose among these available options when designing experiences for the user to enter information.

* `Dialogs` are used for very simple input/acknowledgment and appear next to the user click target
* `Context panes` are used when more space is needed and the input form does not need to invoke any child blades.  Context panes appear on the rightside of the screen, vary in width and float over other content.
* `Full screen blades` are used when the input form needs the space or will invoke a child blade
* `Full screen blades from resource menu` are used when the input form is invoked directly from the resource's resource menu and serves the purpose of showing the current information and the edit experience for that information
* `Wizard` is a type of full screen blade with tabs across the top and is used to guide a user as they provide input when creating azure resources

## Anatomy
<!-- TODO get anatomy for dialog and context pane Use common numbers for elements -->
<div style="max-width:800px">
<img alttext="Form anatomy" src="../media/design-patterns-page-forms/form-anatomy.png"  />
</div>

A form can contain:
1. Labels and corresponding input fields
2. Command buttons or another call to action
3. Error messaging
4. Field and Form validation

## Behavior
As the user enters information, field content is validated.  Upon form submission, the entire form is validated.

### Validation

#### Placeholder text
Include placeholder text can be formatted in two ways:
1. As an instruction
<div style="max-width:300px; margin-left:25px">
<img alttext="Placeholder instruction" src="../media/design-patterns-page-forms/placeholder_text.png"  />
</div>

2. As an example of valid input format
<div style="max-width:150px; margin-left:25px">
<img alttext="Placeholder example" src="../media/design-patterns-page-forms/placeholder-email.png"  />
</div>

#### Field validation
Don’t make users guess password requirements. Instead, include the password validation tool in your experience.
<div style="max-width:300px">
<img alttext="Form validation" src="../media/design-patterns-page-forms/form-validation.png"  />
</div>

#### Error messaging
Provide highly visible and specific error messages.

### Control recommendations
#### Use radio buttons instead of toggles
The blue and white toggle used in the portal today has tested poorly among users because it's unclear which option is selected, especially if the choice is between 2 options.

The current guidance is to use radio buttons in favor of the toggle.
<div style="max-width:150px">
<img alttext="Radio control" src="../media/design-patterns-page-forms/radio-control.png"  />
</div>

### Command button recommendations
The buttons for submitting and cancelling a form should follow these recommendations.  The sections for each type of form follow this list and call out any special casing for that form type.  Sometimes a forms blade is invoked from multiple places.  For example, the `Tag resource` blade is invoked from a resource menu on most Azure resource and also invoked in a context pane from the essentials control.  In this case, the `Tag resource` blade is designed as a fullscreen blade form opened from a resource menu and does not follow the recommendations of a typical context blade form.

* Buttons are at the bottom of the page in a non-scrollable docked area
* Use a single `Close` button if experience is informational only
* Use `Yes` and `No` buttons for destructive actions and include a confirmation question in the dialog - "Delete this VM?"
* Use the "action name", like **Move**, **Save**, **Attach**, **Add**, for the submit button and `Cancel` as the button to close the dialog
* Use `Ok` and `Cancel` as a last resort if a better action name is not apparent

<!-- TODO Should the "submit" buttons for forms always be active, so that user can get form validation -->
<!-- TODO Edit columns uses `Apply` and `Reset`, no close button -->
<!-- TODO Tag resource uses toolbar, no close button -->

#### Dialog - command buttons
Follow the button recommendations above
<!-- TODO Should clicking away from dialog cause it to close?  It does for Stop/Delete VM (Yes, No) but not the Attach/Detach nic example -->

#### Context pane - command buttons
* Use buttons at the bottom of the page, follow button recommendations above
* Don't use a toolbar at the top of the page
    * If context pane contains a grid, attach grid actions to the grid with a grid-level toolbar

#### Fullscreen blade form - command buttons
* Use buttons at the bottom of the page, follow button recommendations above
* Use a toolbar at the top of the page only if page represents a more fully featured management experience - `VM > Alerts > Manage alert rules`
    * All buttons go in the toolbar using the naming conventions above
    * No `Close` button, the blade has an `X` in the upper right corner to close it

#### Fullscreen blade from opened from a resource menu - command buttons
* Use a toolbar at the top of the page when the form is opened from a resource menu - `VM > Tags` and `VM > Diagnostics settings`
* All actions go in the toolbar using the naming conventions above
* No `Close` button, the blade has an `X` in the upper right corner to close it


#### Create wizard command buttons - see the [resource create pattern](design-patterns-resource-create.md) for details


## Do
-   Use inline labels and fields for full screen pages and stacked labels and fields for narrow blades

-   Mark required fields with a red asterisk * to distinguish them from optional fields

-   Include info bubbles if there are input fields that may not be immediately familiar

-   Left align all the of the input fields in a column. Jagged edges are difficult to skim

-   Visually group related labels and fields. [Labels should be close to the fields](https://www.nngroup.com/articles/form-design-white-space/) they describe (immediately above the field for context panes or next to the field for long forms). Avoid ambiguous spacing where labels are equidistant from multiple fields.

## Don't 
-   Don't use the toggle picker when a property has two options. (See above 'Toggles vs radio buttons')

-   Don't phrase labels as questions. Keep labels short and sweet.

-   Don't include fields that stretch across the full width of the page.

-   Avoid buttons for clearing a form. The risk of accidental deletion outweighs the unlikely need to start over.


## Related design patterns
* Full screen [design-patterns-page-fullscreen.md](design-patterns-page-fullscreen.md)
* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Design patterns [top-design.md](top-design.md)


## Research and usability

## Telemetry

# For developers
Developers can use the following information to get started implementing this pattern

## Tips and tricks

## Related documentation
* Dialog [top-extensions-dialogs.md](top-extensions-dialogs.md)
* Context Pane [top-extensions-context-panes.md](top-extensions-context-panes.md)
* Forms [top-extensions-forms.md](top-extensions-forms.md)
* Forms [portalfx-forms.md](portalfx-forms.md)
