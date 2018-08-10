
<a name="icon-incorrectly-displayed"></a>
### Icon incorrectly displayed

***My icon is a dark square. What happened? ***

DESCRIPTION:

The extension probably circumvents the build-time icon pre-processing that  prepares the icon to pass the  html sanitizer. This may cause it to display incorrectly. The pre-processor also minifies the icon, and it to display properly using different theme colors.

**NOTE**: The icon may still display incorrectly if it is served by using **json**.

SOLUTION: 

Include the icon in your project normally. Build and  look at the generated file.  Find and copy the  fresh sanitized svg markup, and replace it.

* * *
 
<a name=""></a>
### 

