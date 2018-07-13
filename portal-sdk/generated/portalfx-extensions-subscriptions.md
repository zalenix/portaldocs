
<a name="subscriptions"></a>
# Subscriptions

There are several ways that extensions handle subscriptions. For the most part, extensions only use the list of user-selected subscriptions. However, extensions can also retrieve subscription details and subscription resources. 
Extensions that have subscription resources should use [Browse v2](top-extensions-browse.md), which handles the complexity of aggregating resources across subscriptions on behalf of the extension. All supplemental data can be obtained using specified resource ids to ensure the extension does not query or poll for more data than is necessary.

Get Subscription List

* [Get subscription list](#get-subscription-list)

* [Get subscription details](#get-subscription-details)

* [Get subscription resources](#get-subscription-resources)

<a name="subscriptions-get-subscription-list"></a>
## Get subscription list

The `getSelectedSubscriptions()` function gets the list of selected subscriptions, as in the following code.

```ts
MsPortalFx.Azure.getSelectedSubscriptions().then((subs: Subscription[]) => {
    ...
});
```

The `getAllSubscriptions()` function gets all subscriptions for the user, as in the following code.

```ts
MsPortalFx.Azure.getAllSubscriptions().then((subs: Subscription[]) => {
    ...
});
```

<a name="subscriptions-get-subscription-details"></a>
## Get subscription details

Extensions need subscription details to perform the following tasks.

* Determine if a resource is in a disabled subscription
* Show the subscription display name in resource properties
* Make a decision based on the quota id
* Show resources for all filtered subscriptions

Extensions need the details of only one subscription for these first 3 scenarios. The `getSubscriptionInfo()` function gets the subscription details, as in the following code.

```ts
MsPortalFx.Azure.getSubscriptionInfo(subId).then((sub: Subscription) => {
    var name = sub.displayName,
        isDisabled = sub.state.toLowerCase() === "disabled",
        quotaId = sub.subscriptionPolicies.quotaId;
    ...
});
```

<a name="subscriptions-get-subscription-resources"></a>
## Get subscription resources

On template blades, use a `ResourceFilter` control to show content across subscriptions. Locked blades can add the `ResourceFilterPart` to the top of the blade. Unlocked blades can add a subtitle that represents the selected subscriptions, and they can add a `Filter` command that displays the subscription filter in a context pane in a manner similar to locked blades. Parts can add a subtitle that represents the selected subscriptions, and they can  expose a `Filter` command in a manner similar to unlocked blades.

Format the selected subscription label in the following format for one subscription: : ```"{subscription.displayName}"```. For two or more subscriptions, format the label as in the following example: ```"{count} subscriptions"```. For all subscriptions, the label is "All subscriptions".

<!--TODO: Determine whether the API has been developed yet.  If so, remove this note. -->

**NOTE**: The Ibiza team is developing an API that contains label calculation methods.

The `ResourceFilter` control shows resources across subscriptions. To add the control to your template blade, use a `pcControl` binding and use the observables on the `ViewModel` on the blade, as in the following code.

```ts
  this.resourceFilter = new MsPortalFx.Azure.ResourceFilter.ViewModel(this._container, {
        actionHandler: this.gridViewModel,
        showTextFilter: ko_observable(true),
        showSubscriptionFilter: ko_observable(true),
        showSubscriptionSummary: ko_observable(false),
        showTenantLevelSubscriptionSummary: ko_observable(false),
        textFilterPlaceholder: ko_observable<string>("Search here")
  });
```

If the extension contains a locked blade that shows resources across subscriptions, add the `ResourceFilterPart` from Hubs and bind its outputs to the inputs on the extension's part, as in the following code.

```xml
<PartReference Name="Filter" PartType="ResourceFilterPart" InitialSize="FullWidthFitHeight">
  <PartReference.PropertyBindings>
    <Binding Property="textFilterEnabled" Source="{Constant true}" />
  </PartReference.PropertyBindings>
</PartReference>
<PartReference Name="List" PartType="BrowseResourceListPart" InitialSize="FullWidthFitHeight">
  <PartReference.PropertyBindings>
    <Binding Property="filter"
             Source="{PartProperty Part=Filter, Property=filter}" />
    <Binding Property="selectedSubscriptions"
             Source="{PartProperty Part=Filter, Property=subscriptions}" />
    <Binding Property="subscriptionsFiltered"
             Source="{PartProperty Part=Filter, Property=subscriptionsFiltered}" />
  </PartReference.PropertyBindings>
</PartReference>
```

The following part inputs are supported.

**textFilterEnabled**: Optional. Specifies whether the text filter is visible. Defaults to false. 

**subscriptionsFilterEnabled**: Optional. Specifies whether the subscription filter is visible. Defaults to true. 

**textFilterPlaceholder**: Optional. Specifies the text filter placeholder when empty. Defaults to "Filter items..." 

**selectedSubscriptionId**: Optional. Specifies the subscription id to show. This will hide the subscription filter. Defaults to null.

The following part outputs are supported.

**filter**: Text filter value.

**selectedSubscriptions**: Array of selected subscriptions.

**subscriptionsFiltered**: Boolean value that indicates whether subscriptions have been filtered or not.