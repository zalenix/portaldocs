# Context panes

Context panes are a different visual representation of blades. The main difference is that they do not cause the screen to horizontally scroll when navigating to a context pane. Instead, the context pane is displayed in front of the current content, beginning at  the right side of the screen, as in the following image.  This allows the user to interact with the context pane while retaining the context of the previous experience.

### When to use a context pane

Context panes are primarily used as leaf blades in your navigation experience. For example, if you want to present the user with properties that they can edit, or if you want to have the user create an entity, a single context pane is a good design choice.

### Examples of a context pane

An example of a context pane is in the following image.

![alt-text](../media/portalfx-blades/contextBlade.png "Context Pane")

### How to author a context pane

A context pane can be authored as a standard blade implementation. The extension can call a variant of the blade-opening APIs that will instruct the Portal to open the context pane at the location at which you want to open the pane. 
An example of using a context pane is located at `<dir>/Client/V1/Navigation/OpenAndCloseBladeApis/ViewModels/OpenBladeApiSamplesViewModel.ts`. It is also in the following code.

```
{"gitdown": "include-file", "file": "../Samples/SamplesExtension/Extension/Client/V1/Navigation/OpenAndCloseBladeApis/ViewModels/OpenBladeApiSamplesViewModel.ts"}
```
    
For information about blade references, see [top-blades-opening-and-closing.md#open-blade-methods](top-blades-opening-and-closing.md#open-blade-methods).
