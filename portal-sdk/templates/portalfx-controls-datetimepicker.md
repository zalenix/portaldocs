## DateTimePicker

The `DateTimePicker` control provides an easy way select date and time, for example, "6/5/2017 1:45:00 PM."  The `DateTimePicker` control is the recommended control for date and time selection.

**NOTE**:  All previous controls that provided this functionality are obsolete.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

1. The DateTimePicker control is used by importing the module, as in the following code.

   ```c#
    import * as DateTimePicker from "Fx/Controls/DateTimePicker";
   ```

1. Then, create the ViewModel.

   ```c#
   public dateTimePicker: DateTimePicker.Contract;

   this.dateTimePicker = DateTimePicker.create(container, {
       label: "someLabel"
       //Other options...
   });

   ```

1. Insert the `DateTimePicker` control as a member of a Section, or include it in an HTML template by using a 'pcControl' binding. The sample is located at 
`<dir>\Client\V2\Controls\DateTimePicker\DateTimePickerBlade.ts`  . This code is also included in the working copy located at [http://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimePickerInstructions/selectedItem/DateTimePickerInstructions/selectedValue/DateTimePickerInstructions](http://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimePickerInstructions/selectedItem/DateTimePickerInstructions/selectedValue/DateTimePickerInstructions).

By default, this control displays the date according to the user's local time zone offset, as specified in [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset). If the `showTimezoneDropdown` option has a value of `true`, users can choose a `timezoneOffset` using the Timezone Dropdown. The ViewModel's `value` property will always normalize the date/time value to the user's local `timezoneOffset`. Typically, servers return [UTC](top-extensions-glossary.md) dates that are converted by the `DateTimePicker` control to display the user's locale in the ViewModel `value` property.

Be aware that the timezone is not the offset for the timezone. If the extension needs to use timezones to ensure constant scheduling time, it should set `showTimezoneDropdown` to `false`, and use a separate dropdown control that it populates with the timezones for the server.  There are several Web sites that provide international time zones; the [IANA](top-extensions-glossary.md) timezones are located at  [https://www.iana.org/time-zones](https://www.iana.org/time-zones). 

For more information about timezone offsets and timezone names, see [http://tantek.com/2015/218/b1/use-timezone-offsets](http://tantek.com/2015/218/b1/use-timezone-offsets).

## Migrating from `DateTimeCombo` or `DateTimeComboBox`

If the extension previously combined two `DateTimeComboBoxes` together to select a date/time range, it should be updated to use the `DateTimeRangePicker` object, as specified in [portalfx-controls-datetimerangepicker.md](portalfx-controls-datetimerangepicker.md). The procedure is as follows.

1. Update the namespace with DateTimePicker.

    * Old code

    ```
    var dateTimeVM = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeCombo.ViewModel(container, {...});

    //or
    var dateTimeVM = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeComboBox.ViewModel(container, {...});
    ```

 

   * New code

    ```
    import * as DateTimePicker from "Fx/Controls/DateTimePicker";
    var dateTimeVM = DateTimePicker.create(container, {...});
    ```
 

1. If the `DateTimeComboBox.formatString` was set, it should be removed from the extension. The new `DateTimePicker` does not support formatting the datetime value. The values are presented in the general long date/time pattern by default, for example, " 6/7/2017 4:20:00 PM". An example of the code that should be removed is as follows.

    ```
    dateTimeVM.formatString("G");
    ```
