
# Extension Controls

## Overview 

Controls are the building blocks of the Azure extension experience. They allow users to view, edit, and analyze data. Using built in controls provides consistency across the portal.  Additionally, issues around usability, accessibility, security and any other fundamentals are handled by the Framework team.

To render a control in the portal, you need to create a `ViewModel` and bind it to your html template.

Creating a control `ViewModel` involves calling a factory method from a framework-provided module.  All of the modules live under `Fx/Controls/`, as in the following example.

```ts
import * as <alias> from "Fx/Controls/<ControlName>"; // this will pull in the <ControlName> module
```

All of the factory methods have similar signatures, like the following.

```ts
<alias>.create(lifetimeManager, configurationOptions);
```

The **Knockout** binding for all controls is the `pcControl` binding, as in the following code.

```ts
<div data-bind='pcControl: myControl'></div>
```

Taken together, creating a blade as specified in [top-blades-template.md](top-blades-template.md) that contains only a textbox would look something like the following.
<!-- TODO: Find a sample for this -->
```cs
import * as TemplateBlade from "Fx/Composition/TemplateBlade";
import * as TextBox from "Fx/Controls/TextBox";  // import statement for the control

@TemplateBlade.Decorator({
    htmlTemplate:
        "<div data-bind='pcControl: myTextbox'></div>" // div which binds to the textbox viewmodel
})
export class AddUserBlade {
    public title = ClientResources.bladeTitle;
    public subtitle = ClientResources.bladeSubtitle;
    public context: TemplateBlade.Context<void, MyArea.DataContext>;

    /**
     * textbox viewmodel declaration
     */
    public myTextbox: TextBox.Contract;

    public onInitialize() {
        const { container } = this.context;
        
        // textbox viewmodel factory method used to initialized the textbox;
        this.myTextbox = TextBox.create(container, {
            label: "this is my textbox"
        });

        return Q();
    }
}
```

Form controls are a subset of controls which are used to gather user input.  You can see more information about forms at [top-extensions-forms.md](top-extensions-forms.md).

{"gitdown": "include-file", "file": "../templates/top-extensions-controls-playground.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-samples-controls.md"}

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-controls.md"}
    
{"gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-controls.md"}

