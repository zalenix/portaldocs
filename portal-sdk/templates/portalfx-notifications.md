
## Notifications

A notification is a short message that informs the user about an event that has occurred, or may occur, in the system. Notifications contain useful and relevant information.

The Notifications menu aggregates messages across all Portal extensions and cloud-connected services. It does this by using local client notifications and global server events from the Event service. Messages can be informational, warnings, or errors, as in the following image.

![alt-text](../media/portalfx-notifications/notifications.png "Notifications help project status and progress")

If you are using one of the older, PDL-based Notifications APIs, use the Notifications v3 upgrade guide located at [portalfx-notifications-migration.md](portalfx-notifications-migration.md) to convert your code to a newer edition.

### Notification statuses

The following list contains the correct statuses for notifications.

**InProgress**: Long-running operation has started or is executing. It may be creating new resources or changing state.

**Info**: Successful or non-critical updates, like state changes, that do not require action on the part of the user.  Some examples are stopped websites and services.

**Advisory**: Informational or potential warnings, issues under investigation, or changes that should have no impact. This includes upcoming data migrations or outage investigations.

**Warning**: Problem or issue that might require attention, or could result in a more critical error. One example is a  certificate that is  about to expire.

**Error**: Problem or condition that should be investigated, like data loss.

**Critical**: Urgent problem or condition that needs immediate action or attention. An example is a VM that crashed.

**NOTE**: Use the **Info** notification instead of the **Success** notification, which is being deprecated.

### Client notifications

 Local client notifications are only visible in the current browser session. When the browser is refreshed,  all local client notifications are lost.
 
#### One-time notification

The design of the extension may require one-time notifications that are not part of a long-running operation and do not result in server events.  In these instances, the extension should publish a notification with the title, description, status, and linked asset. When the notification is clicked, the associated asset will be opened.

To link a notification to an asset, the extension specifies the asset details, as in the following example. 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    asset: {
        extensionName: ExtensionDefinition.definitionName,
        assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
        assetId: assetId
    }
});
```

To link a notification to a blade directly, the extension specifies the blade details, as in the following code. 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    linkedBlade: {
        extension: "extensionName",
        detailBlade: "BladeName",
        detailBladeInputs: {
            bladeInputProperty1: "bladeInput1"
        }
    }
});
```

To link a notification to a deeplink, the extension specifies the deeplink URI, as in the following code. 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    uri: "#asset/HubsExtension/ResourceGroups/subscriptions/12345689-dg32-4554-9a9a-b6e983273e5f/resourceGroups/Default"
});
```

### Server events

Server events are maintained by the public Event service. The Event service tracks all service events, which may be aggregated into larger operations. The aggregates are then displayed as notifications within the Portal. The Notifications Hub automatically displays notifications for all critical, error, and completed deployment events. Server events are preferable to client notifications because they can be persisted.

#### Suppressing server events

When a client notification is associated with a server event, add the correlation id from the Event service. The Portal will suppress server events to ensure that duplicate notifications are not published if the extension specifies the correlation id.

**NOTE**: Azure Resource Manager (ARM) automatically publishes server events for every operation. If the extension initiates ARM operations, it should extract the Event service correlation id from the `x-ms-correlation-request-id` response header.

#### In-progress notifications for long-running operations

If an operation requires calling a server-side API or may take more than 2 seconds, use an in-progress notification to track it. Server events may take up to 1.5 minutes to display in the Portal. Effective use of  both server events and client notifications can be  critical to ensuring UI responsiveness. Using the following steps when initiating long-running operations will ensure that the UI is as responsive as possible. 

1. Create an in-progress, local client notification previous to calling the server
1. Initiate the server operation, which should create an in-progress server event
1. Copy the correlation id from the Event service to the client notification to avoid duplicate notifications
1. Poll for status updates and update the client notification as appropriate
1. When the operation is complete, update the title and description, and re-publish the client notification
1. Finalize the operation with necessary UI processing

**NOTE**: If warnings or errors occur during the execution of the long-running operation, but do not affect the overall outcome, the extension should publish separate server events and  client notifications to track those issues.

The procedure creates a new client notification, starts an operation, and then updates the notification accordingly, as in the following code.

```ts
// publish an in-progress server event
var n = new MsPortalFx.Hubs.Notifications.ClientNotification({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress,
    asset: {
        extensionName: ExtensionDefinition.definitionName,
        assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
        assetId: assetId
    }
});
n.publish();

// start server event
...

// save correlation id from ARM response and re-publish
n.correlationIds.push(xhr.getResponseHeader("x-ms-correlation-request-id"));
n.publish();

...

// update the notification
n.percentComplete = 25;  // .1 == .1%, 10 == 10%
n.publish();

...

// finish processing
n.percentComplete = 100;
n.status = MsPortalFx.Hubs.Notifications.NotificationStatus.Information;
n.publish();
```

### Best Practices for notifications

* Avoid raising notifications that users will not care about, or will not act on to resolve an issue.

* Avoid using multiple notifications when a single notification will suffice.

* Do not use notifications too often.

* Be as specific as possible, and follow the [voice and tone](portalfx-extensions-glossary-notifications.md) guidelines when defining notifications. Notifications might be referenced out of context, for example, within the Hub instead of in the asset blade. Consequently, generic messages may not make sense or may not provide enough information.

* Associate notifications with assets, and ensure there is a clear next-action. When a notification is clicked, the related asset is opened. If a notification does not have an asset, it is essentially a useless dead-end. 

#### Client notifications

* Only use local client notifications if the error originates on the client and does not apply to other users.

* If you need to open a different blade based on asset metadata, or open a blade from another extension, use dynamic blade selection on the associated asset type. 
If you need to open a different blade for a specific message, the extension should  change the associated asset before re-publishing the notification.

#### Server notifications

* Always prefer global server events by integrating with the Event service. Every event originating from a back-end system should be processed as a server event. This will ensure they are available to additional users and across browser sessions.

* Always use server events for non-read operations, and for any events that originate on a server or end system.

* Server events are used to track asset history. Even if a change is considered to be unimportant, the extension should raise a low-priority Info event to track it appropriately.

<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-notifications.md"}
--.
