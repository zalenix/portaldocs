
<a name="overview"></a>
## Overview

Historically, resource management in Azure required extensions to perform operations against one resource at a time. Management of complex applications that used multiple resources became a complex task. Consequently, the resource group was created to serve as the lifecycle boundary for every resource contained within it.

Resource groups enable an extension to manage all of its resources together. Typically a group contains resources that are related to a specific application. Management functionality is provided by Azure Resource Manager (ARM), which groups multiple resources as a logical group. For example, applications that run in Microsoft Azure use a combination of resources, like database server, database, and website, to perform as designed.

An Azure Resource Manager Template, as specified in [http://aka.ms/portalfx/quickstart](http://aka.ms/portalfx/quickstart), allows an extension to aggregate, deploy and manage these resources  by using a JSON description of the resources and associated deployment parameters. The provisioning API for ARM simplifies deployment of ARM templates by allowing you to submit a request to ARM, and receive a notification that indicates that the deployment is complete. The API can send the notifications, but you can suppress them as appropriate. The deployment steps are as follows.

* Submit a request to ARM that specifies which template to deploy, and the parameters required to satisfy that template.

    The deployment template could be a link to a template, like the ones that are typically uploaded to the gallery service as part of the gallery package. It might also be an inline JSON that is constructed on request. ARM will either accept the request and respond with a correlation id, or deny it. If the request is accepted, ARM begins the deployment of the template by provisioning the resources that are described by the template.

* Poll for deployment updates to know whether the deployment has been accepted, is running, succeeded, or failed. You can also poll for operations, where ARM returns a snapshot of current operations and their statuses. One of these polls will inform you whether the provisioning of your resource(s) has completed.

<a name="deploy-arm-templates"></a>
## Deploy ARM templates

The code that deploys an ARM template is the following.

```ts
MsPortalFx.Azure.ResourceManager.deployTemplate(options);
```

The `options` object contains the following variables.
   
* **subscriptionId**: The subscription id.

* **deploymentName**: The name of the resource deployment.
 
* **resourceGroupName**: The name of the resource group.

 <!--TODO:  Determine whether this is the location/region of  the user or the server. -->

* **resourceGroupLocation**: The location or region in which the resource group will operate.

* **resourceProviders**: An array of the resource providers to register in the subscription.

 * **templateLinkUri**: The URI for the deployment template. This property and the  `templateJson` property are mutually exclusive.

 * **templateJson**: The inline deployment template JSON. This property and the  `templateLinkUr` property are mutually exclusive.

 * **parameters**: The template parameters required by ARM to satisfy the template that is being deployed.

 * **deploymentMode**: Optional. The template deployment operation mode. This parameter impacts the behavior of the promise that is returned by the API.  Its values are as follows.

    * **RequestDeploymentOnly**: A deployment request will be submitted to ARM. The promise will resolve or reject when ARM accepts or denies the request. This is the default value.

    * **DeployAndAwaitCompletion**: A deployment request will be submitted to ARM. The promise will report progress when ARM accepts the request. The promise will resolve or reject when ARM provisions or fails to provision the deployed resources. The status of the operations is not reported while the deployment is in progress. Operations are reported on success or on failure.

    * **DeployAndGetAllOperations**: The same as `DeployAndAwaitCompletion`, except that the promise continuously reports on the progress of ARM operations. Operations are also reported on success.

    If you choose to perform the polling yourself, set the `deploymentMode` to `RequestDeploymentOnly` and wait for ARM to accept the request and return a correlation id. You can use the correlation id to poll for deployment updates using the `MsPortalFx.Azure.ResourceManager.pollForDeployment` method that is described in [#poll-for-updates](#poll-for-updates).  Polling can continue until ARM completes  provisioning the deployed resources.

 * **suppressDefaultNotifications**: Optional. A flag that specifies whether to suppress default deployment notifications. Defaults to false.

<a name="poll-for-updates"></a>
## Poll for updates

The API is used to poll for deployment updates if you have the correlation id of an existing deployment.  This id is returned when a deployment request is accepted by ARM. The API returns a promise that is resolved or rejected when the deployment succeeds or fails.  The code that polls for deployment is the following.

```ts
MsPortalFx.Azure.ResourceManager.pollForDeployment(options);
```

The `options` object contains the following variables.
   
* **subscriptionId**: The subscription id.

* **deploymentName**: The name of the resource deployment.
 
* **resourceGroupName**: The name of the resource group.

* **correlationId**: The correlation id for the deployment for which to poll.

 * **getAllOperations**: Optional. Flag that specifies whether to report on all operations. Operations are also reported on success. Polling is done every ten seconds for the first minute, then every minute for the next five minutes, then every five minutes afterwards. If polling fails because of a timeout or because of an ARM internal server error, the API will retry up to three times. If the value is set to true, the promise will continuously report ARM operations as progress occurs. The default value is false.

The result that is returned when the promise resolves or reports on progress is described in [#template-deployment-and-polling-results](#template-deployment-and-polling-results).

<a name="template-deployment-and-polling-results"></a>
## Template deployment and polling results

The result that is returned when the promise resolves contains the following structure.

 * **correlationId**: The correlation id.

 * **provisioningState**: The state of the provisioning operation.  It has a value of "accepted", "running", "succeeded", or "failed".

 * **timestamp**: The timestamp when the reported operation was completed.

 * **operations**: When available, the list of deployment operations. This is only returned if the `deploymentMode` is set to `DeployAndGetAllOperations` for deployment requests, or if `getAllOperations` is set to true for polling requests.

<a name="sample-code"></a>
## Sample code

The following samples request a template deployment, and provide for the three different types of results, depending on the value of the `deploymentMode` parameter.

* Requesting a template deployment

    ```ts
    // Prepare the template deployment options.
    var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
        subscriptionId: "1e215951-cf63-4cd9-b5c5-748a1f97e984",
        deploymentName: "Samples.Engine",
        resourceGroupName: "armDeploymentTestRG",
        resourceGroupLocation: "centralus",
        resourceProviders: [ "EngineRP" ],
        templateLinkUri: "http://uri-of-arm-template"
        // Or -> templateJson: "json",
        parameters: {
            name: "engine-test-1",
            displacement: "disp-1",
            model: "engine-v1"
        },
        // Defaults to -> suppressDefaultNotifications: false,
        // Defaults to -> deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.RequestDeploymentOnly
    };

    // Deploy the template.
    MsPortalFx.Azure.ResourceManager.deployTemplate(options)
        .then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // ARM accepted the deployment request.
            // Store the correlation id if you want to poll for deployment updates afterwards.
            // Do something with the result. 
        }, (error: any) => {
            // Something went wrong!
        });
    ```

* Deploy a template and await completion

    This code should be used when the extension will await completion of the request, as specified in the template deployment options in the code.

    If your extension's UI reflects the deployment progress, the extension should persist the correlation id  because the user can abandon a session and return to it. If such is the case, the extension should continue reflecting deployment progress when it is reloaded.

    ```ts
    // Prepare the template deployment options.
    var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
        // Same options as in sample #1, except:
        deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.DeployAndAwaitCompletion
    };

    // Deploy the template.
    MsPortalFx.Azure.ResourceManager.deployTemplate(options)
        .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // Will be called only once, when ARM accepts the deployment request.
            // Store the correlation id if you have UI that reflects the progress and the user abandons the session.
        }).then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // Deployment is complete. 
        }, (error: any) => {
            // Something went wrong!
        });
    ```

* Deploy a template and get all operations

    This code should be used when the extension will get all operations and await completion of the request, as specified in the template deployment options in the code.

    If your extension's UI reflects the deployment progress, the extension should persist the correlation id  because the user can abandon a session and return to it. If such is the case, the extension should continue reflecting deployment progress when it is reloaded.

    ```ts
    // Prepare the template deployment options.
    var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
        // Same options as in sample #1, except:
        deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.DeployAndGetAllOperations
    };

    // Deploy the template.
    MsPortalFx.Azure.ResourceManager.deployTemplate(options)
        .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // First time will be called when ARM accepts the deployment request. 
            // Store the correlation id if you have UI that reflects the progress for the case when the user abandons the session.
            // Subsequent calls will continuously reports progress (and operations) while the deployment is in progress.
        }).then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // Deployment is complete.
        }, (error: any) => {
            // Something went wrong!
        });
    ```

* Request a template deployment and poll for updates

    These calls are not cached, so if the user abandons the session by closing the browser or navigating away before the request makes it to ARM, the call to this API will result in nothing.

    ```ts
    // Prepare the template deployment options.
    var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
        // Same options as in sample #1.
    };

    // Deploy the template.
    MsPortalFx.Azure.ResourceManager.deployTemplate(options)
        .then((deploymentResult: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
            // ARM accepted the deployment request.
            // Store the correlation id if you have UI that reflects the progress for the case when the user abandons the session.

            // Prepare polling options.
            var pollingOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentPollingOption = {
                // Use the same info from the original deployment.
                subscriptionId: deploymentOptions.subscriptionId,
                deploymentName: deploymentOptions.deploymentName,
                resourceGroupName: deploymentOptions.resourceGroupName,
                // Use the correlation id returned.
                correlationId: deploymentResult.correlationId,
                // Optional:
                getAllOperations: true
            };

            // Poll for updates.
            MsPortalFx.Azure.ResourceManager.pollForDeployment(pollingOptions)
                .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
                    // Continuously reports progress (and operations) while the deployment is in progress.
                }).then((pollingResult: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
                    // Deployment is complete.
                }, (error: any) => {
                    // Something went wrong!
                });
        }, (error: any) => {
            // Something went wrong!
        });
    ```
