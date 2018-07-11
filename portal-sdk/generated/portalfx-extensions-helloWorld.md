<a name="hello-world-extension"></a>
# Hello World Extension
 
 
<a name="hello-world-extension-introduction"></a>
## Introduction
 
Blades are the main unit of the user experience (UX) that can be built using the Azure SDK. They are pages that can be loaded in the Portal.

Blades are components that are developed as part of the extension, and can be rendered at specific locations in the Portal UI. They are opened by using the `container.openContextPane(...)` API, as specified in the `MsPortalFx.d.ts` file of the project.

<a name="hello-world-extension-overview"></a>
## Overview

Use the following steps to develop a blade.

1. You and your team will determine the types of blades that can be grouped together into one area.  Because these blades will probably share data, the area is also known as a `DataContext` that is meaningfully named.  In this example, the data context for blades is named `Greetings`, and the blade that is being developed is named `Aloha`. Remember to remove the angle brackets when substituting the name of the `DataContext` group for the parameter name `<AreaName>`.

1. Add a folder for the group of blades within the `Client` folder of the project. It should be named the same as the area.

    ![alt-text](../media/portalfx-extensions-helloWorld/areaFolder.png "Area Folder")

1. Add a file for the new blade to the folder. The file should be named the same as the blade. In the following image, the name of the blade is `Aloha`.

    ![alt-text](../media/portalfx-extensions-helloWorld/areaBladeFile.png "New Blade in Folder")

1. Also add a file that describes the area to the area folder.  The name of the file should be the name of the group, concatenated with the word ‘Area’. This is also known as the  `DataContext`.

    ![alt-text](../media/portalfx-extensions-helloWorld/areaGroupFile.png "GreetingsArea describes the area or datacontext")

1. Within the `GreetingsArea.ts` file that was just created, add the following code.

    ```cs
    export class DataContext {
    }
    ```

1. There are some basic sections that are required in the `Aloha.ts` blade file.  The first section  is the import statements, as in the following example.

    ```cs
    import * as TemplateBlade from "Fx/Composition/TemplateBlade";
    import { DataContext } from "./<AreaName>Area"; // todo – substitute the name of the area, and remove the angle brackets 
    ```

1.	The second code section  is the template blade decorator. This lets the framework discover the blade. It is also where the html template is defined.

    The following  example shows the first part of a simple text data-binding. The corresponding data-binding code is in the next example.

    ```js
    @TemplateBlade.Decorator({
        htmlTemplate: `<div data-bind='text: helloWrldMsg'></div>`
    })

    export class <BladeName> // todo – substitute the name of the blade, and remove the angle brackets 
    {

    }
    ```

1.	The following code implements the class for the new blade. In this instance the code sets the title, subtitle, and binds the string 'Hello world!' to the UI. This code should be added to the class in the TemplateBlade decorator from the preceding step.

    **NOTE**: the text from the `data-bind` statement is named the same as the message, thereby completing the binding.

    ```cs
        public title = "My blade title";
        public subtitle = "My blade subtitle";
        public context: TemplateBlade.Context<void, DataContext>; // there are useful framework APIs that hang off of here
        public helloWrldMsg = ko.observable("Hello world!"); // this is bound in the div statement in the previous example 

        public onInitialize()
        {
        // initialization code should be inserted here
           return Q();   // if the extension will load data then return a loading promise here
        }
    ```

1.	 The extension can now be compiled.

        **NOTE**:  The blade title in the browser is not the same as the blade name as displayed in Visual Studio.

1.	Test the new extension by using a link in the following format in the address bar of the browser.

    ```
    <PORTAL URI>#blade/<extensionName>/<bladeName>
    ```
  
    where

    **#blade**: a literal

    **extensionName**: The name of the extension that contains the blade

    **bladeName**: The name of the blade that is being developed


    One example is as follows.
    ```json
    https://portal.azure.com#blade/HelloWorld/Aloha 
    ```

    Keep in mind that there may be parameters to pass to Azure that affect the loading of the Portal.  In the following case, the parameters are included in the URL previous to the name of the blade.

    ```json
    https://portal.azure.com/?feature.customportal=false&feature.canmodifyextensions=true#blade/HelloWorld/Aloha
    ```

    Also, test extensions may be added to the URI after the name of the blade that was just added, as in the following example.

    ```json
    https://portal.azure.com/?feature.customportal=false&feature.canmodifyextensions=true#blade/HelloWorld/Aloha?testExtensions={"HelloWorld":"https://localhost:44300/"}
    ```

    When the site is properly accessed, the blade from this example should resemble the following image.

    ![alt-text](../media/portalfx-extensions-helloWorld/helloWorldExtensionAlohaBlade.png "New Extension and blade")



<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-helloWorld.md"}
-->
