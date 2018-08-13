
### Icon incorrectly displayed 

***The extension icon is displayed as a dark square. What happened?***

DESCRIPTION:

The extension probably circumvents the build-time icon pre-processing that  prepares the icon to pass the  html sanitizer. This may cause it to display incorrectly. The pre-processor also minifies the icon, and it to display properly using different theme colors.

**NOTE**: The icon may still display incorrectly if it is served by using **json**.

SOLUTION: 

Include the icon in your project normally. Build and  look at the generated file.  Find and copy the  fresh sanitized svg markup, and replace it.

For more information, see [top-extensions-style-guide.md#preserve-icon-colors-over-theme-changes](top-extensions-style-guide.md#preserve-icon-colors-over-theme-changes).

* * *
 
###

