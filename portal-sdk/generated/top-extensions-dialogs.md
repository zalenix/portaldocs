
<a name="dialogs"></a>
## Dialogs

Dialogs allow the developer to display information to the user with very little navigation. Dialogs may be as simple as a short confirmation, or as complex as a form. They can be both targeted and non-targeted, such that they either display at the top of the blade or they display in context of another piece of UI. The following is an image of a non-targeted dialog.

![alt-text](../media/portalfx-ui-concepts/dialog-non-targeted.png "Non-targeted dialog")

The following is an image of a targeted dialog.

![alt-text](../media/portalfx-ui-concepts/dialog-targeted.png "Targeted dialog")

<a name="dialogs-when-to-use-dialogs"></a>
### When to use dialogs

Dialogs are great to use in cases where an extension requests a confirmation from the user, or if it needs the user to update a small piece of information. Dialogs are more lightweight than context blades; however, if the dialog becomes overloaded, you may want to use a context blade instead.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. 

<a name="dialogs-the-dialog-api"></a>
### The dialog API

Dialogs expose various options that allow developers to customize the dialog experience. To open a dialog, the extension should specify `dialogOptions`. The simplest form of those options is the 'Simple dialog' implementation that is located at `<dir>\Client\V2\Dialogs\DialogSamplesBlade.ts` and in the following code.

```typescript

/**
 * This sample demonstrates how a simple dialog with some text and a OK button can be opened
 */
public onSimpleDialogClick() {
    const { container } = this.context;

    container.openDialog({
        telemetryName: "SimpleDialog",
        title: ClientResources.Dialog.SimpleDialog.title,
        content: ClientResources.Dialog.SimpleDialog.message,
        buttons: DialogButtons.OK,
        onClosed: (result) => {
            // this callback is invoked when the dialog is closed
            // result.button maybe inspected to see which button was clicked.
        },
    });
}

```

The properties for this implementation of the dialog are as follows.

| Property | Definition |
| -------- | ---------- |
| Buttons | The buttons to surface to the user. These can be the predefined button combinations that the framework offers, or you can specify your own custom labels, as specified in [#dialogs-with-custom-buttons](#dialogs-with-custom-buttons). |
| Content | The string or `htmlContent` to display to the user. |
| onClosed | A callback function that is called when the user closes the dialog by selecting a button. |
| telemetryName | The name that is logged for any telemetry events that occur while the user interacts with the dialog. |
| Title | The string that is shown to the user as the title of the dialog. |

After the `options` object is defined, the extension can call `container.openDialog(yourDialogOptions)` and send in the `dialogOptions`.

<a name="dialogs-dialogs-with-custom-buttons"></a>
### Dialogs with custom buttons

To specify a dialog with custom buttons, send an array to the `buttons` property in the `dialogOptions`.  This implementation  is in the following code. 
<!-- TODO: Locate the  interface implementation, which  is not in `<dir>\Client\V2\Dialogs\DialogSamplesBlade.ts` -->

```
/**
* Describes a custom button in a dialog
*/
export interface CustomDialogButton {
/**
* Display text of the button
*/
displayText: string;
/**
* Button identifier that is programatically passed back
*/
button: DialogButton;
}
```

<a name="dialogs-displaying-complex-scenarios-in-dialogs"></a>
### Displaying complex scenarios in dialogs

In a dialog, if you want to allow the user to pick a value from a slider or interact with some other custom UI, make use of  a custom HTML template. You can achieve that by providing an object of type `HtmlContent` to the `content` property in the dialog options. 

Here we define our custom dialog `ViewModel`, which only contains a slider control. We then define a simple html template, which is only the control, and specify our   `dialogViewModel`.  

 The sample is located at  `<dir>\Client\V2\Dialogs\DialogSamplesBlade.ts` and in the following code.

```typescript

public onDialogWithTemplateClick() {
    const { container } = this.context;
    const dialogViewModel = {
        slider: Slider.create(container, {
            label: ClientResources.slider,
            max: 10,
            min: 0,
            value: 8,
            ariaLabel: ClientResources.sliderAriaLabel,
        }),
    };
    const dialogContent: HtmlContent = {
        htmlTemplate: `<div data-bind='pcControl: slider'></div>`,
        viewModel: dialogViewModel,
    };

    container.openDialog({
        telemetryName: "DialogWithCustomTemplate",
        title: ClientResources.Dialog.Template.title,
        content: dialogContent,
        buttons: DialogButtons.OK,
    });
}
//top-extensions-dialogs#mouse 
/**
 * This click handler opens the dialog targeted towards a different element using a selector
 */
public onTargetWithSelectorClick() {
    this._openDialog(".ext-color-text");
}
//top-extensions-dialogs#mouse
/**
 * This click handler opens the dialog targeted at the element which the click came from
 *
 * @param evt Mouse event generated by the user click
 */
public onTargetWithFxElementClick(evt: FxMouseEvent) {
    this._openDialog(evt.target);
}

```

<a name="dialogs-targeting-the-dialog-at-a-specific-element-or-cssselector"></a>
### Targeting the dialog at a specific element or cssSelector

If you want to provide context to which the dialog applies, for example, confirming a delete of a certain item, this can be made possible by specifying a `string | FxElement` which either captures the `cssSelector` or, in the case of `FxElement`, the element of the control or `div`. 

In the following example, the `fxClick` creates an `FxElement` and sends it as a parameter to the `fxClick` handler.

```typescript

@TemplateBlade.Decorator({
htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <p><a data-bind='fxclick: onSimpleDialogClick'>Open a simple dialog</a></p>" +
    "  <p><a data-bind='fxclick: onDialogWithCustomButtonsClick'>Open a dialog with custom buttons</a></p>" +
    "  <p><div data-bind='text: dinnerSelection'></div></p>" +
    "  <p><a data-bind='fxclick: onDialogWithTemplateClick'>Open a dialog with a provided custom template</a></p>" +
    "  <p><a data-bind='fxclick: onTargetWithSelectorClick'>Target a dialog to a element with a selector</a></p>" +
    "  <p><a class='ext-color-text' data-bind='fxclick: onTargetWithFxElementClick, style: {color: colorSelection}'>Target a dialog to a element with FxElement</a>" +
    "</div>",
})

```
<!-- [BradO] Sorry, but it's not clear how this onTarget method relates to 'onClick' nor is it clear how 'FxMouseEvent' relates to 'FxElement'.  -->
When the  `fxClick` element is clicked, it is sent as a parameter to the onClick `fxClick` handler, as is specified in the sample located at  `<dir>\Client\V2\Dialogs\DialogSamplesBlade.ts` and in the following code.

```ts

```typescript

   /**
    * This click handler opens the dialog targeted towards a different element using a selector
    */
   public onTargetWithSelectorClick() {
       this._openDialog(".ext-color-text");
   }

```

```

The `target` property on the dialogOptions is `evt.target` and the dialog will open in context of your element.

For targeting elements via `cssSelectors` you send  the desired cssSelector as a string to the `target` property on the dialogOptions.

```
container.openDialog({
	telemetryName: "DialogTargetingViaCSS",
	title: ClientResources.Dialog.SimpleDialog.title,
	content: ClientResources.Dialog.SimpleDialog.message,
	buttons: DialogButtons.OK,
	target: ".ext-color-text"
});
```

The extension defines the `target` property on the `dialogOptions` as `evt.target`. The  dialog will open within the context of the element.

To target elements by using `cssSelectors`,  send the specific `cssSelector` as a string to the `target` property on the `dialogOptions`.

<a name="dialogs-positioning-the-dialog-when-targeting"></a>
### Positioning the dialog when targeting

When the extension specifies a target, it should  also  specify where the dialog is displayed,  relative to that target. To do so, you can send a `positionHint` to the `dialogOptions`. The screen positioning will be honored if the space is available; otherwise, it will fallback to an available space.

/**
* option hint for requested dialog position. Defaults to BottomLeftEdge.
*/
export const enum DialogPosition {
TopLeftEdge = 1,
RightTopEdge = 2,
BottomLeftEdge = 3,
LeftTopEdge = 4,
}
