
<a name="overview"></a>
## Overview

Many alerts for extension behavior are provided by the Portal Framework. Alerts run at a specified time to assess the previous hour of data. If a threshold for an alert is met, an ICM alert that contains the details of the alert is opened and sent to  the  team that owns the extension. Azure Portal partner team IcM information is collected during the onboarding process, and is located at [https://aka.ms/portalfx/partners](https://aka.ms/portalfx/partners). This maps extension names to IcM team names and service names. An IcM routing rule is added under "Azure Portal (Ibiza) service" in IcM to route incidents to corresponding partners.   The routing rule is in the following format.

 `AIMS://AZUREPORTAL\Portal\{ExtensionName}`

The Portal Framework provides the following alerts.

1. Extension SDK expiration

    A Sev3 IcM incident for an extension when its SDK is older than 60 days, and a Sev2 IcM incident for an extension when its SDK is older than 90 days

1. Extension alive
1. Create regression
1. [Availability](#availability)
1. Performance
1. [Client error](#client-error)

The Framework also provides an infrastructure so that teams can configure alerts to send for each extension. Each area of the infrastructure is separate, so that the Framework can allow various levels of custom configuration. Specified sets of conditions are met previous to meeting or exceeding the  alert threshold.  The alert areas are as follows.

1. Create

1. [Availability](#availability)

1. Performance

1. [Client error](#client-error)


<!-- TODO: Determine whether this sentence is still accurate.

 Today it only applies to availability, performance and client error, we are working on expanding it into the other areas.
 -->

The Portal has a daily extension customization Json backup from **Azure SQL** to **Kusto**.  You can view your extension alert customization Json in **Kusto** by using the site located at [https://ailoganalyticsportal-privatecluster.cloudapp.net/#/discover/query/results](https://ailoganalyticsportal-privatecluster.cloudapp.net/#/discover/query/results) and replacing `DefaultCriteria` with `Alert_YOUR_EXTENSION_NAME`. That function will not exist until you onboard the extension to the alerting infrastructure, as specified in [#onboarding-to-the-alert-infrastructure](#onboarding-to-the-alert-infrastructure). You can also view  a read-only version of the configuration by using  the alerting tool that is located at [https://aka.ms/portalfx/alerting-onboarding](https://aka.ms/portalfx/alerting-onboarding). 



<a name="onboarding-to-the-alert-infrastructure"></a>
## Onboarding to the alert infrastructure

1. Generate the desired per extension configuration by manually editing the JSON file, or by using the alerting tool that is located at [https://aka.ms/portalfx/alerting-onboarding](https://aka.ms/portalfx/alerting-onboarding).
    
1. Fill out the work item that is located at  [https://aka.ms/portalfx/alerting-onboarding](https://aka.ms/portalfx/alerting-onboarding).

1. Set up the following correlation rules in ICM.

    * **Routing ID**: For create regression 'AIMS://AZUREPORTAL\Portal' <br/> For all others 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
 
    * **Correlation ID**:  Specific to alert.  Use the following values. 

        * Availability - Extension: **ExtensionLoadAvailability**

        * Availability - Blade: **BladeLoadAvailability**

        * Availability - Part: **PartLoadAvailability**

    * **Mode**: Hit count (recommended). Other modes are .

    * **Match Slice**: Checked.

    * **Match Severity**: Checked.
 
IF the correlation rules need to be updated for your extension, reach out to 
<a href="mailto:ibizafxhot@microsoft.com;azurefxg@microsoft.com?subject=Extension Alert Configuration&body=My team would like to update the correlation rules for our extension.  The configuration to update is <Alert_YOUR_EXTENSION_NAME>.  The updated configuration is attached.">ibizafx hot@microsoft.com and azurefxg@microsoft.com</a>  and attach the updated configuration. We will inform you when the updates are applied. 
 
<a name="availability"></a>
## Availability

Alerts can be configured for extension availability, blade availability and part availability. They run every five minutes to assess the previous hour of data.  A sample availabilty alert is in the following code.

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

Within the previous sections, two different sets of custom criteria can be defined. Only blades or parts can be configured as an inclusion or exclusion model, as in the following code.


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

The parameters are as follows.

* **critical**: Maps to the severity of the alert to trigger in ICM. This parameter is not mutually exclusive with **nonCritical**, which allows the developer to opt into two different levels of alerting with different configurations.

* **nonCritical**: Maps to the severity of  the alert to trigger in ICM. This parameter is not mutually exclusive with **nonCritical**, which allows the developer to opt into two different levels of alerting with different configurations.

* **minFailureUserCount**: The minimum number of unique users that encountered a failure previous to meeting or exceeding the error threshold.

* **minFailureCount**: The minimum number of failures that have occurred. In the previous  example,  the configuration requires 5 or more failures for a critical failure.

* **minAvailability**: The minimum availability, expressed as a percentage. For example, an extension fails to load 10 out of 100 times has a minimum availability rating of 90%.

* **enabled**: A Boolean that specifies whether to use the alert.

* **severity**:  The priority of the alert. An alert that is prioritized as severity 1 receives immediate attention due to factors like portal outage.  Lower severity alerts are priorized appropriately. 

* **exclusion**:  This only applies to blades or parts. Specifies what blades or parts cannot send this alert. Developers  can either use an inclusion model and specify the names to include,  or use an exclusion model and specify the names to exclude.

* **inclusion**:  This only applies to blades or parts. Specifies what blades or parts can send this alert. Developers  can either use an inclusion model and specify the names to include,  or use an exclusion model and specify the names to exclude.

Availability alerts will trigger when **minFailureUserCount**, **minFailureCount**, and **minAvailability** are met or exceeded.  In the previous example, the alert assesses the data that was accumulated during last hour for the extension, blade or part. Based on that data, the critical configuration will only fire when five or more unique users encounter five or more failure occurrences and the total availability decreasses to 80%.  If all of these conditions are met, then a severity 3 alert will be opened and sent to the team that owns the blade or part.

<a name="client-error"></a>
## Client error

The two types of client error alerts are error percentage alerts and error message alerts. Error percentage alerts fire when the percentage of users experiencing an error is above the specified threshold. Error message alerts report from different environments including national clouds, and they fire for error messages that are categorized by **messageLogicalAnd** and **messageLogicalOr**. 

Error percentage alerts run every 15 minutes, and error message alerts run every five minutes.  They assess the previous 60 minutes of telemetry data that is stored in the **Kusto** database.

Configuring client alerts requires a set of environments in which the alerts can be triggered, and an error configuration for the alert.  Alerts are supported in national clouds by specifying national cloud portal domain names in the `environment` property in the alert customization Json. A sample client error alert is in the following alert customization JSON code.


```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"], // National clouds are supported.
            "availability": [...], // Optional. Add it when you want to enable availability alerts.
            "clientError": [
                {
                    "type": "message",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                },
                {
                    "type": "percentage",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
            ],
            "create": [...], // Optional. Add it when you want to enable create alerts.
            "performance": [...], // Optional. Add it when you want to enable performance alerts.
        },
        {
            "environment": ["ms.portal.azure.com"],
            ...
            "clientError": [
                {
                    ...
                }
                ...
             ],
            ...
        }
        ...
    ]
    ...
}
```

The parameters are as follows.

* **extensionName**: The name of the extension.

* **enabled**: Specifies whether to use the alert.  A value of `true` enables the alert.

* **environments**:  The array whose elements represent a set of environments.

    * **environment**:  The array whose elements represent the names of the environments for the alert. Multiple values can be set for this property. The values can be the MPAC and PROD environments, in addition to portal domain names like  "canary.portal.azure.com" or "portal.azure.cn". An asterisk ("&ast;") represents all Azure Portal Production environments, like *.portal.azure.com. Alerts are supported in national clouds by specifying national cloud portal domain names.

    * **availability**:  Optional. Availability alert criteria, as specified in [#availability](#availability).

    * **clientError**:  The alerting criteria for the specified environment. It contains the following values.

        * **type**: The type of client error message that triggers an alert. The values are **message** and **percentage**. A message  can have one type or both types. 
        
        * **enabled**: Specifies whether to use the alert type.  A value of `true` enables the alert type, and a value of `false` disables the alert type.

        * **criteria**: The criteria for the client error alert. Any number of criteria can be specified. As many as three  messages can be specified in one criterion. The following example contains the criteria for a **message** error alert.
            
            ```json
            "criteria":[
                {
                    "severity": 4,
                    "enabled": true,
                    "checkAllNullRefs": true, // Optional.
                    "message1": "Cannot read property", // Optional.
                    "message2": "of null", // Optional.
                    "minAffectedUserCount": 1,
                    "exclusion": {
                        "type": "or", // Only support value "and", "or".
                        "message1":"eastus2stage",
                        "message2":"eastus2(stage)"
                    },
                    "safeDeploymentStage": ["3"], // Optional. It does not support asterisk("*") sign.
                    "datacenterCode": ["AM"] // Optional.
                },
                ...
            ]
           ```
            
            * **severity**:  The priority of the alert. An alert that is prioritized as severity 1 receives immediate attention due to factors like portal outage.  Lower severity alerts are priorized appropriately.

            * **enabled**: Specifies whether to use the error alert criteria.  A value of `true` enables the alert criteria, and a value of `false` disables the alert criteria.

            * **checkAllNullRefs**: Optional.  A value of `true` , and a value of `false`.

            * **message1**: Optional. First error message that is included in this alert. 

            * **message2**: Optional. Additional error message to include in this alert. 

            * **minAffectedUserCount**:  The minimum number of unique users that encountered a failure previous to meeting or exceeding the error threshold.

            * **exclusion**:  Specifies the name of the messages that cannot send this alert. As many as three messages can be specified. 
                
                * **type**: Valid values are "and" and "or". 

                * **message1**: The name of the entity that cannot send this alert. 

                * **message2**: The name of the entity that cannot send this alert. 
            
            * **safeDeploymentStage**: Optional. Specifies the stage of deployment in which the error occurred.  The field does not support the asterisk("*") sign.  Values are zero ("0") through "4", inclusive.  If this field is not specified, the alert will fire on all safe deployment stages. 

            * **datacenterCode**: Optional. Specifies the data center that is impacted by the alert.  Values are "AM", .
       
        The following example contains the criteria for a **percentage** error alert.

            ```json
             "criteria":[
            {
                "severity": 3,
                "enabled": true,
                "minAffectedUserCount": 2,
                "minAffectedUserPercentage": 10.0,
                "exclusion": {
                    "type": "or", // Only support value "and", "or".
                    "message1":"eastus2stage",
                    "message2":"eastus2(stage)"
                },
                "safeDeploymentStage": ["3"], // Optional. It does not support asterisk("*") sign.
                "datacenterCode": ["AM"] // Optional.
            },
            ...
            ]
            ```
           
            * **severity**:  The priority of the alert. An alert that is prioritized as severity 1 receives immediate attention due to factors like portal outage.  Lower severity alerts are priorized appropriately.

            * **enabled**: Specifies whether to use the error alert criteria.  A value of `true` enables the alert criteria, and a value of `false` disables the alert criteria.

            * **minAffectedUserCount**:  The minimum number of unique users that encountered a failure previous to meeting or exceeding the error threshold.
            
            * **minAffectedUserPercentage**:  The minimum percentage of unique users that encountered a failure previous to meeting or exceeding the error threshold.
            
            * **exclusion**:  Specifies the name of the messages that cannot send this alert. As many as three messages can be specified. 
                
                * **type**: Valid values are "and" and "or". 

                * **message1**: The name of the entity that cannot send this alert. 

                * **message2**: The name of the entity that cannot send this alert. 
            
            * **safeDeploymentStage**: Optional. Specifies the stage of deployment in which the error occurred.  The field does not support the asterisk("*") sign.  Values are zero ("0") through "4", inclusive.  If this field is not specified, the alert will fire on all safe deployment stages. 
            
            * **datacenterCode**: Optional. Specifies the data center that is impacted by the alert.  Values are "AM", .
      
    * **create**:  Optional. Create  alert criteria, as specified in [#create](#create).

    * **performance**:  Optional. Performance alert criteria, as specified in [#performance](#performance).

 
<a name="client-error-what-is-error-configuration"></a>
### What is error configuration?

Error configuration is an array of criteria to run against that environment and safe deployment stage. See definition [below](#client-error-configuration-what-is-safe-deployment-stage).

<a name="client-error-what-is-safe-deployment-stage"></a>
### What is safe deployment stage?






<a name="client-error-what-is-minaffecteduserpercentage"></a>
### What is minAffectedUserPercentage?

This is the minimum number of percentage of users affected by any client error.

<a name="client-error-what-is-minaffectedusercount"></a>
### What is minAffectedUserCount?

This is the minimum number of users affected by any client error.

<a name="how-often-do-they-run"></a>
## How often do they run?

Currently error alerts run every 30 minutes assessing the previous 90 minute of data.

<a name="how-do-i-onboard"></a>
## How do I onboard?

1.	Generate the desired per extension configuration

    - This can be done by manually editing the error JSON file.

1.	Fill out the following work item [https://aka.ms/portalfx/alerting-onboarding][alerting-onboarding]
1.	Set up correlation rules in ICM


| Field | Value |
| -----  | ----- |
| Routing ID | For all others 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
| Correlation ID | Specific to alert, use table below to map |
| Mode | Hit count (recommended) |
| Match Slice | Checked |
| Match Severity | Checked |
| Match Role | Checked |
| Match Instance/Cluster | Checked |


| Alert | Correlation ID |
| ----- | -------------- |
| Error - AffectedUserPercentage | ErrorAffectedUserPercentage |
| Error - Message | ErrorMessage |

<a name="what-happens-if-i-need-to-update-alert-configuration"></a>
## What happens if I need to update alert configuration?

1.	Contact [ibizafxhot](mailto:ibizafxhot@microsoft.com) and attached the updated configuration
1.	We will respond as soon as possible and apply the updates

<a name="how-do-i-know-my-extension-s-current-configuration"></a>
## How do I know my extension&#39;s current configuration?

Within Kusto your configuration will be defined under a function. To find the function use the this [link][alerting-kusto-partner] and replace `ErrorAlert_Ibiza_Framework` with `ErrorAlert_YOUR_EXTENSION_NAME`. The function will only exist once you have onboarded to the alerting infrastructure.


[alerting-onboarding]: https://aka.ms/portalfx/alerting-onboarding
[alerting-kusto-partner]: https://Azportal.kusto.windows.net/Partner?query=ErrorAlert_Ibiza_Framework()&web=1