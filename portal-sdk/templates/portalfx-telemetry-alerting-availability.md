# Availability

The alerts can be configured for extension availability, blade availability and part availability. 

## Configuration

```json
{
    ...
    "availability": {
        "extension": {
            ...
        },
        "blade": {
            ...
        },
        "part": { 
            ...
        }
    }
    ...
}
```

Per each of those, you can define two different sets of custom criteria like the below.

> Only blade's or part's can be configured as an inclusion or exclusion model

```json
{
    "customCriteria": { 
        "critical": { 
            "minFailureUserCount": 5, 
            "minFailureCount": 5, 
            "minAvailability": 80, 
            "enabled": true, 
            "severity": 3 
        }, 
        "nonCritical": { 
            "minFailureUserCount": 1, 
            "minFailureCount": 1, 
            "minAvailability": 99.9, 
            "enabled": true, 
            "severity": 4 
        } 
    }, 
    "exclusion": ["AllWebTests","test"],
    // "inclusion": ["OnlyRealParts"]
}
```

### What is the difference between critical and non-critical?

This maps to the severity you want the alerts to trigger in ICM. This allows you to opt into two different levels of alerting with different configuration.

### What is minFailureUserCount?

This is the minimum number of unique users who have to encountered a failure before the threshold is surpassed.

### What is minFailureCount?

This is the minimum number of failures that have occurred, for example the above configuration requires 5 or more failures.

### What is minAvailability?

This is the minimum availability as a percentage. For example your extension fails to load 10 out of 100 times that would be 90% available.

### What is inclusion/exclusion? 

This only applies to blades or parts and defines what blades or parts to alert on, you can either use an inclusion model and specify the names you wish to include or
an exclusion model and specify the names you wish to exclude.

### When do the alerts trigger?

Alerts will only trigger when all 3 of the criteria are met (AND). So the above critical configuration will only fire when
5 or more unique users encounter failures *AND* there are 5 or more failure occurences *AND* the total availability < 80%, all within the last hour.
Only then will a severity 3 alert be opened.

## How often do they run?

Currently they run every 5 minutes assessing the previous hour of data.

## How do I onboard?

1. Generate the desired per extension configuration
    - This can be done by either manually editing the JSON file or making use of [the tool][alerting-tool] provided.
1. Fill out the following work item [https://aka.ms/portalfx/alerting-onboarding][alerting-onboarding]
1. Set up correlation rules in ICM

| Field | Value |
| -----  | ----- |
| Routing ID | For create regression 'AIMS://AZUREPORTAL\Portal' <br/> For all others 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
| Correlation ID | Specific to alert, use table below to map |
| Mode | Hit count (recommended) |
| Match Slice | Checked |
| Match Severity | Checked |


| Alert | Correlation ID |
| ----- | -------------- |
| Availability - Extension | ExtensionLoadAvailability |
| Availability - Blade | BladeLoadAvailability |
| Availability - Part | PartLoadAvailability | 
 
## What happens if I need to update them?

1. Contact [ibizafxhot](mailto:ibizafxhot@microsoft.com) and attached the updated configuration
1. We will respond as soon as possible and apply the updates

## How do I know my extension's current configuration?

Within kusto your configuration will be defined under a function. To find the function use the [this link][alerting-kusto-partner] and replace `DefaultCriteria` with `Alert_YOUR_EXTENSION_NAME`. That function will only exist once you have onboarded to the alerting infrastructure.
Or visit [the tool][alerting-tool] to view a read only version of your config, again this is only available once you have onboarded.


[alerting-onboarding]: https://aka.ms/portalfx/alerting-onboarding
[alerting-tool]: https://microsoft.sharepoint.com/teams/azureteams/docs/PortalFx/Alert
[alerting-kusto-partner]: https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal.kusto.windows.net/databases/Partner?q=H4sIAAAAAAAEAEvOKS0uSS3SUHesKsgvKknMUdfUS0ksSUxKLE7VUApILCrJSy1S0tRzSU1LLM0pcS7KBKrOTNTQBABHZQn9OQAAAA%3d%3d