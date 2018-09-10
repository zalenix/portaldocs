## DropDown

The AMD dropdown contains all the features of the previous dropdowns.

Previously, adding a feature meant porting the code to a different control, or was not possible depending on the combination of features. Now, extensions can turn on filtering or add grouping to a multiselect dropdown.

For more information about migrating to this control, see [#migration-to the-new-dropdown](#migration-to-the-new-dropdown).

### Features

The AMD dropdown supports the following functionality.
* [Accessibility](#accessibility)
* Custom Filtering
* [Filtering and searching](#filtering-and-searching) 
* [Grouping](#grouping)
* [isPopUpOpen](#isPopUpOpen)
* [Multiselect](#multiselect)
* [Multiselect and Filtering](#multiselect-and-filtering) 
* [Objects as the value](#objects-as-the-value)
* [Placeholder](#placeholder)
* [Rich Templating](#rich-templating)

<!--TODO:  Determine what is meant by 
* Custom Filtering
, this also gives you a hook to replace items on keystroke.
-->

### How to use the AMD module

1. The  AMD module is used by importing the module, as in the following code.

    ```typescript
    import * as DropDown from "Fx/Controls/DropDown";
    ```

1. Then, create the ViewModel.

    ```typescript
    // Items to populate the dropdown with.
    let myItems = [{
        text: "Sample text",
        value: "SampleValue"
    }, {
        text: "Sample text 2",
        value: "SampleValue2"
    }];

    this.dropDownVM = DropDown.create(container, {
    items: myItems
    });
    ```


    Another example of a DropDown ViewModel is in the following code. It implements a loading indicator that uses a dropdown.

    ```ts

    // Initialize control with no data. Set loading indicator to true
    const dropDownViewModel = DropDown.create<string>(container, {
        label: ClientResources.spouse,
        validations: [ new Validations.Required(ClientResources.emptySpouse) ],
        loading: true  // ...and dynamically switch to 'false' once the dropdown items are loaded.
    });

    // fetch data asynchronously and remove loading indicator on data load
    const dropdownDataPromise = Q(model.people.fetch("", container)).then((people) => {
        const dropDownItems = people.data.mapInto(container, (childLifetime: MsPortalFx.Base.LifetimeManager, person: SamplesExtension.DataModels.Person) => {
            return {
                text: person.name(),
                value: person.name()
            };
        }, dropDownViewModel.items);
        dropDownViewModel.loading(false);
    });
    ```


### Accessibility 

The Azure Portal handles most accessibility.

**NOTE**: If an html template or image binding is used in item text, an `ariaLabel` should be added on that item.


### Filtering and searching
For large lists of items, an extension can turn on `filtering: true` to enable searching.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true
});
```

#### filterPlaceholder 

Populates the search with a placeholder. It overwrites the `placeholder` property on the dropdown.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true,
   filterPlaceholder: "Search items"
});
```

### Grouping

Dropdown items can be grouped together by expanding the dropdown item with a group type, as in the following example.
 
```typescript
let myItems = [{
    text: "Sample header text",
    children: [{
        text: "Sample text",
        value: "SampleValue"
      }, {
          text: "Sample text 2",
          value: "SampleValue2"
      }]
}]
```

Multiple groups can be grouped together to create a nested layout.

### isPopUpOpen

This a readonly observable to which an extension can subscribe, so that it will be informed when the dropdown is opened or closed. It is used when the loading of items is delayed because they are populated from an expensive **AJAX** call.

```typescript
this.dropDownVM.isPopUpOpen.subscribe(container, (opened) => {
    if (opened) {
        // make your expensive call here.
    }
});
```

### Multiselect

When an extension needs to select multiple items, the `multiselect` can be set to `true` to allow this. Then, the selected items are displayed as "X selected". The multiselect dropdown does not use `placeholder`. Instead, use [`multiItemDisplayText`](#multiitemdisplaytext) as in the following example.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   multiselect: true
});
```

#### MultiItemDisplayText 

The `multiItemDisplayText` changes the format of the default text. Include a {0} in the replaced string to include the number of items selected, as in the following example.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   multiselect: true,
   multiItemDisplayText: "{0} subscriptions"
});
```

### Multiselect and filtering

The dropdown supports both filtering and  multiselect states as active. The filter textbox will move into the dropdown, as in the following example.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true,
   multiselect: true
});
```

### Objects as the value
 
 You can mix filtering and multiselect to have a filterable multiselect DropDown.  When multiselect is true, the `value` property of the DropDown ViewModel is no longer a semicolon-separated string. Instead, `dropDown.value` is of type `TValue[]`, where `TValue` is the generic type argument supplied to `DropDown.create<TValue>`.

### Placeholder

This functionality adds a default string to show that nothing is selected.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   placeholder: "Select an item"
});
```

### Rich Templating

The dropdown supports both filtering & multiselect states as active. The filter textbox will move into the dropdown, as in the following example.

```typescript
let myItems = [{
        text: "<b>G1</b> - large"
        value: "large"
    },{
        text: "<b>G2</b> - small"
        value: "small"
}];

this.dropDownVM = DropDown.create(container, {
   items: myItems
});
```

### Migration to the new DropDown

The following controls are the ones to upgrade to the new AMD dropdown pattern.

```typescript
    MsPortalFx.ViewModels.Obsolete.Forms.DropDown
    MsPortalFx.ViewModels.Obsolete.Forms.FilterComboBox
    MsPortalFx.ViewModels.Obsolete.Forms.GroupDropDown
    MsPortalFx.ViewModels.Obsolete.Forms.MultiSelectDropDown
```
 
The following code is dependent on the use of the `EditScope` observable or the `EditScopeAccessor` observable.  Use one of these two examples to convert your code to the new DropDown.

<details>

   <summary>MultiSelectDropDown was bound to an EditScope observable</summary>

   The following code is a sample of using  `multiSelectDropDownValue` as a path to an `EditScope` observable.

   ```typescript
       this.myMultiSelectDropDown = new MultiSelectDropDown.ViewModel(this._container, this, "multiSelectDropDownValue", {
           ...
       });
   ```

   The following code is an example of using  `multiSelectDropDownValue` as a path to an  `EditScopeAccessor` observable.

   ```typescript
       MultiSelectDropDown.ViewModel(this._container, this, this.createEditScopeAccessor<string>((data) => { return data.multiSelectDropDownValue; }), {
           ...
       });
   ```

   Instead of using either of the previous two samples, switch to the new AMD Dropdown, by performing the following steps.

   1. Add the import that is in the following code. 

        ```typescript
            // Add this import @ the top of the file
            import * as DropDown from "Fx/Controls/DropDown";
        ```

    1. Add the property to the `ViewModel` of the blade.

        ```typescript
            /**
            * ViewModel for the drop down control.
            */
            public dropDown: DropDown.ViewModel<string>; 
        ```

    1. And finally switch to the following code.

        ```typescript
            this.dropDown = new DropDown.ViewModel(container, this, "multiSelectDropDownValue" {
                label: ClientResources.multiSelectDropDownSingleSelectLabel,
                infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon),
                items: items,
            });
        ```

        Or, switch to the following code if the extension uses the `EditScopeAccessor`.

        ```typescript
            this.dropDown = new DropDown.ViewModel(container, this, this.createEditScopeAccessor<string>((data) => { return data.multiSelectDropDownValue; }) {
                label: ClientResources.multiSelectDropDownSingleSelectLabel,
                infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon),
                items: items,
            });
        ```

    1. Follow the instructions in the section named [Multiselect functionality](#multiselect-functionality) to add multiselect and filtering to the new DropDown in your extension.
</details>

<details>

   <summary>MultiSelectDropDown was not bound to an EditScope observable</summary>

   If the `MultiSelectDropDown` in the extension does not use an `EditScope`, it can be converted to an AMD DropDown using the new form field APIs that do not use EditScopes, as specified in [top-extensions-controls.md](top-extensions-controls.md).

   One scenario for the MultiSelectDropDown->DropDown that is becoming obsolete resembles the following code.
   
    ```typescript
        /**
        * ViewModel for the multiselect drop down control.
        */
        public multiSelectDropDownVM: MultiSelectDropDown.ViewModel<string>;
            
        const items: MsPortalFx.ViewModels.Forms.ISelectableOption<string>[] = [
            { text: ko.observable("Item 1"), value: "Value 1" },
            { text: ko.observable("Item 2"), value: "Value 2" },
            { text: ko.observable("Item 3"), value: "Value 3" },
            { text: ko.observable("Item 4"), value: "Value 4" },
        ];

        this.oldMultiSelectDropDownVM = new MultiSelectDropDown.ViewModel<string>(container, {
            label: ko.observable(ClientResources.multiSelectDropDownLabel),
            groups: ko.observableArray<MsPortalFx.ViewModels.Forms.IGroup<string>>([
                <MsPortalFx.ViewModels.Forms.IGroup<string>>{
                    options: ko.observableArray<MsPortalFx.ViewModels.Forms.ISelectableOption<string>>(items)
                }
            ]),
            validations: ko.observableArray([
                new MsPortalFx.ViewModels.RequiredValidation(),
                new MsPortalFx.ViewModels.ContainsValidation("Value 1")
            ])
        });
    ```

To convert to the AMD Dropdown, modify the code to resemble the following example.

  1. Add the import. 

        ```typescript
            // Add this import @ the top of the file
            import * as DropDown from "Fx/Controls/DropDown";
        ```

1. Add the property to the `ViewModel` of the blade.

        ```typescript
            /**
            * ViewModel for the drop down control.
            */
            public dropDown: DropDown.Contract<string>;
        ```

1. Add the new enumeration inside your constructor.
   
    ```typescript
        const items = [ 
            { text: ko.observable("Item 1"), value: "Value 1" },
            { text: ko.observable("Item 2"), value: "Value 2" },
            { text: ko.observable("Item 3"), value: "Value 3" },
            { text: ko.observable("Item 4"), value: "Value 4" },
        ];

        // New basic drop down 
        this.dropDown = DropDown.create<string>(container, {
            label: ClientResources.multiSelectDropDownSingleSelectLabel,
            infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon), 
            items: items, 
        });
    ```


</details>

#### Filtering functionality 

Add `filter: true` to the options in the create call, as in the following code.
  
```typescript
    // DropDown with filtering
    this.dropDown = DropDown.create<string>(container, {
        ...
        filter: true,
        filterPlaceholder: ClientResources.fitlerPlaceholder,   // Optional if you want placeholder text in the filter text box.
    });
```

#### Multiselect functionality

Add `multiselect: true` to the options in the create call, as in the following code.

```typescript
    // DropDown with multiselect
    this.dropDown = DropDown.create<string>(container, {
    	...
    	multiselect: true,
    	selectAll: true // Optional, adds a select all checkbox to the top of the dropdown popup.
    });
```
