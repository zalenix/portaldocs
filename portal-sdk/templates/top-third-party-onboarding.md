# Onboarding Third-Party Extensions

## Overview

It is important to read this guide carefully, as we rely on you to manage the extension registration-configuration management process in the Portal repository. 

**NOTE**: All third-party extensions must be approved by <a href="mailto:ibiza-onboarding@microsoft.com?subject=Third Party Applications (External partners)">Leon Welicki and Adam Abdelhamed</a> before any work can commence on the extension. Please schedule time with them to discuss the details about the extension and get an approval. 

When you receive the approval, you can submit a third-party request by sending an email to <a href="mailto:ibizafxpm@microsoft.com?subject=New Third Party Extension Onboarding Request&body=Extension name:">ibizafxpm@microsoft.com</a> instead of using the internal sites that are in this document. The body of the email should contain the following.

<!--
When you receive the approval, you can submit a third-party request by sending an email to <a href="mailto:ibizafxpm@microsoft.com?subject=New Third Party Extension Onboarding Request&body=Extension name:  &lt;ExtensionName_Extension&gt;  &lt;br&gt; &lt;br&gt;URLs:  (must adhere to pattern) &lt;br&gt; &lt;br&gt;PROD:   &lt;extensionprefix&gt;.hosting.portal.azure.net &lt;br&gt; &lt;br&gt;Contact info:  &lt;email address of a team containing dev and support contacts for incidents related to extension> &lt;br&gt; &lt;br&gt;Business Contacts: &lt;management contacts for escalating issues in case of critical business down situations&gt; &lt;br&gt; &lt;br&gt;Dev leads:  &lt;Contacts of Developer teams who can help upgrade the SDK and deploy changes&gt; &lt;br&gt; &lt;br&gt;PROD on-call email:  &lt;email address of a team containing dev and support contacts for incidents related to extension&gt; &lt;br&gt; &lt;br&gt;">ibizafxpm@microsoft.com</a> instead of using the internal sites that are in this document. The body of the email should contain the following.
-->

**Extension name**: <ExtensionName_Extension> 

**URLs**: (must adhere to pattern)

**PROD**: `<extensionprefix>.hosting.portal.azure.net`

**Contact info**: email address of a team containing dev & support contacts for incidents related to extension

**Business Contacts**: management contacts for escalating issues in case of critical business down situations

**Dev leads**: Contacts of Developer teams who can help upgrade the SDK and deploy changes

**PROD on-call email**: email address of a team containing dev & support contacts for incidents related to extension

**NOTE**: The name of the extension is the same for both the PROD version and the custom deployment version, as specified in [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md). 

For the hosting service, the request should include the name of the extension as `<prefix>.hosting.portal.azure.net/<prefix>`. The email may also contain the extension config file, as specified in [top-extensions-cdn.md#configuring-the-extension](top-extensions-cdn.md#configuring-the-extension).

For more information and any questions about Fx coverage, reach out to 
<a href="mailto:ibiza-onboarding@microsoft.com?subject=Third Party Applications (External partners)">Third Party Applications</a>.

### Communication

Plan ahead for all the outbound communication, blogging, and marketing work that publicizes new services during the time that they are being deployed to customers. This coordination is important, particularly when software release commitments are aligned with the Azure events and conferences. This coordination may be optional for preview releases, but the localized azure.com content and service updates plan are required for stakeholder signoff, if the extension will be deployed to GA.
