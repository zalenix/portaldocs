
<a name="shaping-and-filtering-data"></a>
## Shaping and filtering data

Extensions that use data from  a `QueryCache` will select and filter the items in the cache, or reshape them into formats that are more suited to a specific UI. The **Knockout** observable versions of the `map()` and `mapInto()` methods can be used to accomplish this.

The following data model accepts a `QueryCache` of `Robot` objects as a parameter. 

```ts
interface Robot {
    name: KnockoutObservable<string>;
    status: KnockoutObservable<string>;
    model: KnockoutObservable<string>;
    manufacturer: KnockoutObservable<string>;
    os: KnockoutObservable<string>;
    specId: KnockoutObservable<string>;
}
```

The robots from the `QueryCache` are displayed on  a grid that is three columns wide. The `name` column and the `status` column are the same data as that of the model, but the third column is a combination of the model and manufacturer properties from the model object in the `QueryCache`. The working copy is located at [https://aka.ms/portalfx/projection](https://aka.ms/portalfx/projection). 

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory and  `<dirParent>`  is the `SamplesExtension\` directory. Links to the Dogfood environment are working copies of the samples that were made available with the SDK.

The interface for the shaped data to display in the grid is located at `<dir>\Client\V1\Data\Projection\ViewModels\MapAndMapIntoViewModels.ts`. This code is also included in the following example.

```typescript

/**
* Details for the shaped data that is bound to the grid.
*/
export interface RobotDetails {
   name: KnockoutObservableBase<string>;
   status: KnockoutObservableBase<string>;
   modelAndMfg: KnockoutObservableBase<string>;
}

```

The initial implementation of [data projection](top-extensions-glossary.md) would resemble the following code.

```typescript

const projectedItems = this._view.items.map<RobotDetails>(this._currentProjectionLifetime, (itemLifetime, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: ko.observable(robot.name()),
        status: ko.observable(robot.status()),
        modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer())),
    };
});

```

The `robot.name()` contains the name of the robot, and `robot.model()` and `robot.manufacturer()` respectively contain the model and manufacturer values. The `RobotDetails` interface that models the data in the grid requires observables for the  `name` and `modelAndMfg` properties, therefore they use the strings that are received from the `QueryCache` model. The `projectionId` and `_logMapFunctionRunning` methods are discussed in [#shaping-and-filtering-data](#shaping-and-filtering-data). 

 The grid is configured with the buttons in the middle of the screen.  When the grid is configured with different types of projections, the commands at the top of the screen are used to add, modify, or remove items in the data source.  The output window displays the results of the functions.

1. When the blade opens, click on the **Buggy Map** button to load the grid with the data projection that was previously discussed. Something like the following is displayed in the **log stream** control at the bottom of the blade.

    ```
    Creating buggy map() projection
    Creating a projection (projection id=4, robot=Spring) 
    Creating a projection (projection id=5, robot=MetalHead)
    Creating a projection (projection id=6, robot=Botly)
    Creating a projection (projection id=7, robot=Bolt)
    ```

    The projection was created and sent to the grid. Because there are four items in the `QueryCache`, the projection will run four times, once on each object. Every time the mapping function runs on an item in the grid, this sample creates a new ID for the resulting `RobotDetails` object.

1. Activate the first line in the grid by clicking on it so that the child blade opens. You may need to scroll to the right to view the grid and the child blade.

1. Clicking on the **update status** command at the top of the blade simulates the `QueryCache` receiving a property value for the activated item. Typically, new property values are retrieved by polling the server. Whe the status is updated, the child blade closes and the new status for the robot is displayed.  The activated item is the same item in the `QueryCache`, because the name has not changed, but one of its properties has been updated.

The reason that this implementation is not very performant is because it causes the function to compute a different projected item whenever an observable changes.  This is demonstrated in the sample located at `<dir>\Client/V1/Data/Projection/Templates/UnderstandingMapAndMapInto.html` and in the working copy located at [https://aka.ms/portalfx/projection](https://aka.ms/portalfx/projection).  It is also in the **log** at the bottom of the blade.

    ```
    Updating robot status to 'processor' (robot='Bolt')
    Creating a projection (projection id=8, robot=Bolt)
    ```

When an observable that is associated with the contents of the `QueryCache` model changes, the filtered data that is  projected also changes.  This means that when the `status` observable updates the map's projection, the function runs and computes a different projected item. The object with "projectionId === 4" is gone because it was deleted and replaced with a new item that has the value "projectionId === 8" or some other value. Consequently, the child blade closed because its contents were based on the value of the previous `status` observable. The object that is now in the grid's item has a different `status` value, although it still contains the same `name` and `modelAndMfg`. The previous  `status` observable that was in the `selectableSet's` `activatedItems` observable array no longer exists in the grid's item list.

For more information about displaying the data from the `QueryCache` with a `DataView`, see [portalfx-data-dataviews.md](portalfx-data-dataviews.md).

<a name="shaping-and-filtering-data-how-the-map-function-works"></a>
### How the map function works

When the mapping function runs **Knockout**, it watches to see what observable values are read. Then it takes a dependency on those values, in a manner similar to  **ko.pureComputed** or **ko.reactor**. If any of those values change, **Knockout** is aware that the generated item is out-of-date because the source for that item has changed.

The `map()` function generates an update-to-date projection by running the mapping function again. Remember that any performance benefits in the `map()` function may be negated by running it more times than is necessary. The same thing can happen when the extension updates the `model` property of the top item by clicking the **update model** command.

```
Updating model to 'into' (robot=Bolt)
Creating a projection (projection id=10, robot=Bolt)
```

The following line of code is in the mapping function. 

```
modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer()))
```

This means that the map projection runs again whenever `robot.model()` is observably updated, which removes the old from  the grid and adds an entirely new item.

In some instances, developers do not want the view to be updated with every change to the grid. It is more performant, at least for properties, to send the data from the data model to the grid model previous to updating the grid. To make this happen,  the `status` property observable is sent, instead of getting the current string value out of the observable and sending it into a different observable. Consequently, the mapping function can be updated from ``` status: ko.observable(robot.status()), ``` to  ```status: robot.status,```.

This approach cannot be used with the `modelAndMfg` property because multiple properties need to be combined. In this instance, the one-to-many correspondence can be preserved by combining properties in the data model into one property for  the grid model with a `ko.pureComputed()`, as in the following example.

```
modelAndMfg: ko.pureComputed(() => {
    return "{0}:{1}".format(robot.model(), robot.manufacturer());
})
```

This prevents the `map()` from taking dependencies on `robot.model()` and `robot.manufacturer()` because the `pureComputed()` function takes the dependency on them. Because the `pureComputed()` will update whenever `model()` or `manufacturer()` updates, `ko.map` does not run `map()` to update the projection object  when those observables change in the source model.

A performant  implemenation of the map resembles the following code.

```typescript

const projectedItems = this._view.items.map<RobotDetails>(this._currentProjectionLifetime, (itemLifetime, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: robot.name,
        status: robot.status,
        modelAndMfg: ko.pureComputed(() => {
            this._logComputedRecalculating(projectionId, robot);
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

```

**NOTE**: Ignore the uuid and the logging functions.

You can click on the 'Proper map' button in the sample and perform the same actions to see the difference. Now, updating a property on the opened grid item no longer results in a rerunning of the map function. Instead, changes to `status` are pushed directly to the DOM, and changes to `model` cause the `pureComputed` to recalculate without changing the object in `grid.items()`.

<a name="shaping-and-filtering-data-how-the-mapinto-function-works"></a>
### How the mapInto function works

The following code demonstrates for the same projection, as implemented with the `mapInto()` function.

  ```typescript

const projectedItems = this._view.items.mapInto<RobotDetails>(this._currentProjectionLifetime, (itemLifetime, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: robot.name,
        status: robot.status,
        modelAndMfg: ko.pureComputed(() => {
            this._logComputedRecalculating(projectionId, robot);
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

```

You can see how it behaves when you click on the 'Proper mapInto' button and then add, update, or remove the items. The code and behavior are the same as the `map()` function. The difference between `map()` and `mapInto()` is demonstrated in the non-performant implementation of a projection using `mapInto()`, as in the following code.

```typescript

const projectedItems = this._view.items.mapInto<RobotDetails>(this._currentProjectionLifetime, (itemLifetime, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: ko.observable(robot.name()),
        status: ko.observable(robot.status()),
        modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer())),
    };
});

```

This is the same as the  buggy implementation of `map()`. Click the 'Buggy mapInto' button to activate the top row, and then experiment with updating `status()` and `model()` of the top row. You will see that, unlike map(), that the child blade does not close.  Also, when the source data in the `QueryCache` changes, the observable changes are not present in the projected object. The reason for this is `mapInto()` ignores any observables that were used in the mapping function that was sent to the code. It is therefore guaranteed that a projected item stays the same as long as the source item is around, but if the `map()` is written incorrectly, there is no guarantee that the projected data is up-to-date.

So to summarize:

Function | Projection always guaranteed up to date | Projected object identity will not change
--- | --- | ---
map() | Yes | No
mapInto() | No | Yes

However if the projection is done correctly both functions should work identically.

### Using Knockout projections

In many cases extension authors will want to shape and filter data when  it is loaded by using `QueryView` and `EntityView`.

[Knockout projections](https://github.com/stevesanderson/knockout-projections) provide a simple way to efficiently perform `map` and `filter` functions over an observable array of model objects.  This allows you to add new computed properties to model objects, exclude unneeded properties on model objects, and generally change the structure of an object that is inside an array.  If used correctly, the **Knockout** projections library does this efficiently by only executing the developer-supplied mapping/filtering function when new data is added to the array and when data is modified. The Knockout projections library is included by default in the SDK.  For more information , see the blog post located at  [http://blog.stevensanderson.com/2013/12/03/knockout-projections-a-plugin-for-efficient-observable-array-transformations](http://blog.stevensanderson.com/2013/12/03/knockout-projections-a-plugin-for-efficient-observable-array-transformations/).

The samples extension includes an example of using a projected array to bind to a grid, located at 
`<dir>\Client\Data\Projection\ViewModels\ProjectionBladeViewModel.ts` and in the following code.

```typescript

this._view = dataContext.robotData.robotsQuery.createView(container);

// As items are added or removed from the underlying items array,
// individual changed items will be re-evaluated to create the computed
// value in the resulting observable array.
const projectedItems = this._view.items.mapInto<RobotDetails>(container, (itemLifetime, robot) => {
    return <RobotDetails>{
        name: robot.name,
        computedName: ko.pureComputed(() => {
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

this.grid = new Grid.ViewModel<RobotDetails, string>(
    container,
    projectedItems,
    Grid.Extensions.SelectableRow);

```

### Chaining uses of `map` and `filter`

Often, it is convenient to chain uses of `map` and `filter`:
<!-- the below code no longer lives in samples extension anywhere -->
```ts
// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => {
        return person.smartPhone() === "Lumia 520";
    })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));
```

This filters to only Lumia 520 owners and then maps to just the columns the grid uses.  Additional pipeline stages can be added with more map/filters/computeds to do more complex projections and filtering.
