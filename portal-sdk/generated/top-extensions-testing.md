
<a name="choosing-the-right-test-framework"></a>
## Choosing the right test Framework

Azure provides three different end-to-end test frameworks from which partners can select to develop their own tests. The C# test framework and the Node.js test framework are open source, which enables partners to leverage APIs that are contributed by other partners. A strong open source community that is built around these test frameworks will help improve the development experience for the test frameworks.

<!-- TODO:  Determine which frameworks get the most use, and then re-order this list accordingly. -->

1. Node.js Test Framework

    The Node.js test framework is an end-to-end test framework that runs tests against the Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal. It is downloaded separately from the SDK to allow developers to develop tests in the same language as the extension.  For more information, see [top-extensions-node-js-test-framework.md](top-extensions-node-js-test-framework.md).


1. Typescript Test Framework 

    Ibiza has partnered with the IaaS team to develop an open-source end-to-end TypeScript test framework. We use the test suite for our own extensions, including  abstractions like ‘open blade’ and ‘Navigate to settings blade’. The TypeScript test framework is separate from the Azure SDK, so that so partners can download the most recent version without recompiling against a newer version of the Ibiza SDK. This test framework supports Chrome, and has limited support for directly calling ARM to create/delete resources.  Studies have shown that this test framework is about 20% faster than the C# test framework.   For more information, see [top-extensions-unit-test.md](top-extensions-unit-test.md).

    <!-- TODO: Determine whether the 20% faster is still needed.  If so, determine whether it is still accurate. -->

1. C# Test Framework 

    The C# based test-fx is fully supported by the Ibiza team. The framework is used internally to test the Azure Portal (Shell). It is more mature than the Typescript framework, and contains more Selector API's. It supports the **Chrome** browser, and also haslimited support for Firefox and IE. The C# framework is available for partners to view the code and contribute features and bug fixes. For more information, see [top-extensions-csharp-test-framework.md](top-extensions-csharp-test-framework.md).
