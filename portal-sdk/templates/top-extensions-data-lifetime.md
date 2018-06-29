
## Lifetime Manager

The `lifetime manager` ensures that any resources that are specifically associated with a blade are disposed of when the blade is closed. Each blade has its own lifetime manager. Controls, **Knockout** projections and APIs that use a `lifetime manager` will be disposed when the `lifetime manager` is disposed. That means, for the most part, extensions in the Portal implicitly perform efficient memory management.

There are some scenarios that call for more fine-grained memory management wWhen dealing with large amounts of data, especially virtualized data. The most common case is the `map()` or `mapInto()` function, especially when it is used with a `reactor` or a control in the callback that generates individual items. These items can be destroyed previous to the closing of the blade by being removed from the source array. Otherwise, memory leaks can quickly add up and result in poor extension performance.

**NOTE**: The `pureComputed()` method does not use a lifetime manager because it already uses memory as efficiently as possible.  This is by design, therefore it is good practice to use it. Generally, any `computed` the extension creates in a `map()` should be a `pureComputed()` method, instead of a `ko.reactor` method.

For more information on pureComputeds, see [portalfx-blades-viewmodel.md#the-ko.pureComputed method](portalfx-blades-viewmodel.md#the-ko.pureComputed-method).

### Child lifetime managers 

The maximum amount of time that a child lifetime manager can exist is the lifetime of its parent.  However, they can be disposed before the parent is disposed.

When the developer is aware that extension child resources will have lifetimes that are shorter than that of the blade, a child lifetime manager can be created with the  `container.createChildLifetimeManager()` command, and sent to `ViewModel` constructors or whereever a lifetime manager object is needed. When the extension completes using those resources, the `dispose()` method can be explicitly called on the child lifetime manager. If the `dispose()` method is not called, the child lifetime manager will be disposed when its parent is disposed.

<!-- TODO:  Determine whether the disposing of the  child lifetime manager  when its parent is disposed is implicit. -->

In the following example, a data cache already contains data. Each item is displayed as a row in a grid. A button is displayed in a section below the grid. The `mapInto()` function maps specific data cache items to the view grid items, as specified in [portalfx-data-views.md](portalfx-data-views.md) and [top-extensions-data-projections.md](top-extensions-data-projections.md). It also creates the button to add to the section.  The `itemLifetime` child lifetime manager is automatically created by the `mapInto()` function.

```ts
let gridItems = this._view.items.mapInto(container, (itemLifetime, item) => {
    let button = new Button.ViewModel(itemLifetime, { label: pureComputed(() => "Button for " + item.name())});
    this.section.children.push(button);
    return {
        name: item.name,
        status: ko.pureComputed(() => item.running() ? "Running" : "Stop")
    };
});
```

In this example, when the value of an observable is read in the mapping function, it is wrapped in a `ko.pureComputed`. The `itemLifetime` child lifetime manager was sent to the mapping function as a parameter, instead of sending the `container` into the button constructor. It will be disposed when the associated object is removed from the source array. This means the button `ViewModel` will be disposed at the correct time, but it will still be in the section because the button has not been removed from the section's `children()` array. 

Fortunately, callbacks can be registered with the lifetime manager to use when it is disposed by using the `registerForDispose` command, as in the following example.

```ts
let gridItems = this._view.items.mapInto(container, (itemLifetime, item) => {
    let button = new Button.ViewModel(itemLifetime, { label: pureComputed(() => "Button for " + item.name())});
    this.section.children.push(button);
    itemLifetime.registerForDispose(() => this.section.children.remove(button));
    return {
        name: item.name,
        status: ko.pureComputed(() => item.running() ? "Running" : "Stop")
    };
});
```

Consequently, the `mapInto` function is working as expected, by using the child lifetime manager and the `registerForDispose` command.


