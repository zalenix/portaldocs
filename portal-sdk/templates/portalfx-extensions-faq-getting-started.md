
## Frequently Asked Questions

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

### Getting Started

***Q: I want to create a new extension. How do I start?***

SOLUTION: To contribute an extension to the Portal, you can build an extension in its own source tree instead of cloning the a Portal repository.

You can write an extension by following the instructions in using the [portalfx-extensions-create-first-extension.md](portalfx-extensions-create-first-extension.md), deploy it to your own machine, and load it into the Portal at runtime.

When you are ready to register the extension in the preview or production environments, make sure you have the right environment as specified in  [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md). Then publish it to the environment as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

For more information about Portal architecture, see [top-extensions-architecture.md](top-extensions-architecture.md).

### Getting Help

***Q: I'm stuck. Where can I find help?***

SOLUTION: There are a few ways to get help.

* Read the documentation located at [https://github.com/Azure/portaldocs/tree/master/portal-sdk/](https://github.com/Azure/portaldocs/tree/master/portal-sdk/).

* Read and experiment with the samples that are shipped with the SDK. They are located at `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`   directory. If there is a working copy of the sample in the Dogfood environment, it is located at [http://aka.ms/portalfx/samples](http://aka.ms/portalfx/samples). Sections, tabs, and other controls can be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

* Read the debugging guide located at [top-extensions-debugging.md](top-extensions-debugging.md).

* If you are unable to find an answer, reach out to the Ibiza team at  [Stackoverflow Ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).  For a list of topics and stackoverflow tags, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).


### Broswer Support

***Q: Which browsers are supported?***

SOLUTION: Currently the Portal supports the latest version of Edge, Firefox, Chrome, and Safari, and it also supports Internet Explorer Version 11.

### Blade Commands 

***Q: How do I show different commands for a blade based on the parameters passed to that blade?***

SOLUTION:

This is not possible with PDL-based Commands, but is possible with TypeScript-based commands.
The **Toolbar** APIs allow an extension to call `commandBar.setItems([...])` to supply the list of commands at run-time. For more information, see `<dir>\Client\V1\Blades\Toolbar\Toolbar.pdl`, where  `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK.

