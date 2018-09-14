
# Portal Extension Hosting Service

## Overview

The Ibiza team provides and operates a common extension hosting service that makes it easy to get an extension into a global distribution system without having to manage your own infrastructure.

The hosting service will host the extension's client side code and make it available to the portal across all Azure regions.

Teams that deploy UI for extensions with the classic cloud service model typically have to invest significant amounts of time to onboard to [MDS](top-extensions-glossary.md), setup compliant deployments across all data centers, and configure [cdn](top-extensions-glossary.md), storage and caching optimizations for each extension.

The cost of setting up and maintaining this infrastructure can be high. By leveraging the extension hosting service, developers can deploy extensions in all data centers without resource-heavy investments in the deployment infrastructure.

For less common scenarios, you might need to do a custom deployment. For example, if the extension needs to reach server services using certificate based authentication, then there should be controller code on the server that our hosting service does not support. You should be very sure that a custom hosting solution is the correct solution previous to developing one. For more information, see [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md).

The SLA for onboarding the extension to the hosting service is located at [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md).

You can ask questions on Stackoverflow with the tags [ibiza-deployment](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment) and [ibiza-hosting-service](https://stackoverflow.microsoft.com/questions/tagged/ibiza-hosting-service).

For more information about Stackoverflow, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).

## Instant Onboarding to Extension Hosting

1. You integrate **Content Unbundler**, a tool shipped with framework, as part of your build. This tool generates a zip that has all the static files in your extension.
1. You upload zip file generated in Step #1 to a public read-only storage account owned by your team.
1. You upload a configuration file that contains what versions you want the service to serve

The Hosting service polls the storage account, detects the new version and downloads the zip file in each data center within 5 minutes and starts serving the new version to customers around the world.

For more information about how to deploy an extension with the hosting service, see [top-extensions-hosting-service-procedures.md](top-extensions-hosting-service-procedures.md).

## Hosting service topics

The following is a list of hosting service topics.

| Type                          | Document           | Description |
| ----------------------------- | ---- | ---- |
| Basic Hosting Practices                  | [top-extensions-hosting-service-basic.md](top-extensions-hosting-service-basic.md) | How the hosting service serves an extension |
| Checklists                    | [top-extensions-hosting-service-procedures.md](top-extensions-hosting-service-procedures.md) | Procedures for hosting new blades and converting to custom hosting.       |
| Advanced Topics    |   [top-extensions-hosting-service-advanced.md](top-extensions-hosting-service-advanced.md)  | EV2 Integration, WARM Integration, and other features  | 
| Hosting Scenarios    |   [top-extensions-hosting-service-scenarios.md](top-extensions-hosting-service-scenarios.md)  | Varying the contents of  the `config` file for different types of hosting.  | 

{"gitdown": "include-file", "file": "../templates/portalfx-extensions-faq-hosting-service.md"}

<!--
gitdown": "include-file", "file": "../templates/top-extensions-glossary.md"}
-->
