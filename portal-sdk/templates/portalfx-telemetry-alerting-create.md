# Create

The alerts can be configured for create blade extension on different environments including national clouds.

## Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The create configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"],
            "availability": [...], // Optional
            "clientError": [...], // Optional.
            "create": [
                 {
                    "type": "regression",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
            ],
            "performance": [...], // Optional.
        },
        {
            "environment": ["ms.portal.azure.com"],
            "create": [
                {
                    ...
                }
                ...
             ]
            ...
        }
        ...
    ]
    ...
}
```

### What is environments?
"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com 
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

### What is enabled?
"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level 
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3,
    "enabled": true,
    "bladeName": ["CreateBlade"],
    "minSuccessRateOverPast24Hours":94.0,
    "minSuccessRateOverPastHour":94.0,
    "minTotalCountOverPast24Hours":50,
    "minTotalCountOverPastHour":3
}
```
### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

### What is bladeName?

The list of the create blade name.

### What is minSuccessRateOverPast24Hours?

This is the minimum create blade success rate over the past 24 hours.

### What is minSuccessRateOverPastHour?

This is the minimum create blade success rate over the past hour.

### What is minTotalCountOverPast24Hours?

This is the minimum number of create that gets kicked off over the past 24 hours.

### What is minTotalCountOverPastHour?

This is the minimum number of create that gets kicked off over the past hour.

### When do the alerts trigger?

Every 60 minutes, we get create successRate and create totalCount for the last 60 minutes and the last 24 hours.

Alerts will only trigger when the following criteria are met.

1. Hourly create successRate is below {minSuccessRateOverPastHour} and hourly create totalcount is above {minTotalCountOverPastHour}
1. 24-hour create successRate is below {minSuccessRateOverPast24Hours} and 24-hour create totalcount is above {minTotalCountOverPast24Hours}

### Is National Cloud Supported?
Alerts are supported in national clouds. Specify the national cloud portal domain names in "environment" property. You can use the same criteria for national clouds or different set of criteria.The national cloud domain names are "portal.azure.cn", "portal.azure.us", "portal.microsoftazure.de". You can use any legit national cloud domain name, for instance, "aad.portal.azrue.cn".
```json
{
   ...
    "environments": [
        {
            "environment": ["portal.azure.com", "ms.portal.azure.com", "portal.azure.cn"],
            ...
        },
        {
            "environment": ["portal.azure.cn","portal.azure.us", "portal.microsoftazure.de"],
            ...
        },
        {
            "environment": ["portal.azure.us", "portal.microsoftazure.de"],
            ...
        }
        ...
    ]
    ...
}
```

## How often do they run?

Currently alerts run every 60 minutes assessing the previous 60 minute and previous 24 hours of data.

## How do I onboard?

1. Generate the desired per extension configuration
    - This can be done by manually editing the JSON file.
1. Fill out the following work item [https://aka.ms/portalfx/alerting-onboarding][alerting-onboarding] and attach configuration JSON
1. Set up correlation rules in ICM


| Field | Value |
| -----  | ----- |
| Routing ID | 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
| Correlation ID | use table below to map |
| Mode | Hit count (recommended) |
| Match DC/Region | Checked |
| Match Slice | Checked |
| Match Severity | Checked |
| Match Role | Checked |
| Match Instance/Cluster | Checked |


| Alert | Correlation ID |
| ----- | -------------- |
| Create - Regression | CreateBladeSuccessRate |

## How do I know my extension's current customization?

Click the [this link][alerting-extension-customization] and replace `HubsExtension` with `YOUR_EXTENSION_NAME` and run Kusto function, GetExtensionCustomizationJson. Or go to [https://azportalpartner.kusto.windows.net/Phms][kusto-phms-database] to open Kusto.Explorer and run Kusto function, 
GetExtensionCustomizationJson("YOUR_EXTENSION_NAME"). The regex is supported. You can view alert customization of onboarded extensions. The extension alert customization only exists once you have onboarded to the alerting infrastructure.
> The customizaztion has a daily sync from the SQL database at 5:00 pm PST.

## What happens if I need to update them?

1. Contact [ibizafxhot](mailto:ibizafxhot@microsoft.com) and attached the updated configuration
1. We will respond as soon as possible and apply the updates

[alerting-onboarding]: https://aka.ms/portalfx/alerting-onboarding
[alerting-extension-customization]: https://azportalpartner.kusto.windows.net/Phms?query=GetExtensionCustomizationJson%28%22HubsExtension%22%29
[kusto-phms-database]: https://azportalpartner.kusto.windows.net/Phms