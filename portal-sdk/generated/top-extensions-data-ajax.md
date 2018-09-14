
<a name="authenticating-ajax-calls"></a>
### Authenticating AJAX calls

For most services, developers will make Ajax calls from the client to the server. Often the server acts as a proxy, and makes another call to a server-side API which requires authentication. 

**NOTE**: One server-side API is ARM.

<!-- TODO:  Determine whether LoaderSampleData.ts is still used or has been replaced.  It is no longer in <SDK>\\Extensions\SamplesExtension\Extension.  The closest match is  Client\V1\Data\SupplyData\Templates\SupplyDataInstructions.html -->

When bootstrapping extensions, the portal will send a [JWT token](top-extensions-glossary.md) to the extension. That same token can be included in the HTTP headers of a request to ARM, to provide end-to-end authentication. To make those authenticated calls, the Portal includes an API which performs Ajax requests, similar to the jQuery `$.ajax()` library named `MsPortalFx.Base.Net.ajax()`. If the extension uses a `DataCache` object, this class is used by default. However, it can also be used independently, as in the example located at `<dir>\Client\Data\Loader\LoaderSampleData.ts`.

 This code is also included in the following example.

```ts
var promise = MsPortalFx.Base.Net.ajax({
    uri: "/api/websites/list",
    type: "GET",
    dataType: "json",
    cache: false,
    contentType: "application/json",
    data: JSON.stringify({ param: "value" })
});
```

<a name="batch-ajax"></a>
# Batch AJAX

Extensions that call ARM should always batch their requests. This results in fewer 'options' calls than the `api/invoke` method, and also reduces the number of concurrent network requests.  As many as 20 calls can be batched into a single request.

To batch multiple requests as one, use the batch helpers that are located in the `Fx/Ajax` module, as in the following code.

```typescript
import Batch = require("Fx/Ajax");

// In the supplyData method
return Batch.batch({
    uri: "https://management.azure.com/subscriptions/test/resourcegroups?api-version=2014-04-01-preview",
    type: "GET",
    // Add other properties as appropriate
}).then((batchResponse) => {
    return batchResponse.content;
});
```

**NOTE**: The portal automatically batches multiple requests made with `batch()` together within a single batch request.
* The URI that is sent to the batch call is an absolute URI.
*  The response from a batch call is slightly different from the regular ajax call. The response will be of the form:
*  Allowed methods are - GET, POST, DELETE, HEAD without a request body

<a name="batch-ajax-batch-api"></a>
## Batch API

The following code calls the ARM API by batching multiple requests together.

```typescript
/**
 * Calls the API by batching multiple requests together.
 * Use this API if you have a single AJAX request but there is potential for batching this
 * with other requests.
 *
 * There are a few limitations when using this:
 *   - All requests must have absolute URIs
 *   - The max number of requests in a batch call is 20
 *   - Supports tenant level operations (/subscriptions, /resources, /locations, /providers, /tenants)
 *   - Allowed methods are - GET, POST, DELETE, HEAD without a request body
 *
 * @param settings The settings to use to call batch.
 * @return A promise for the batch call.
 */
export function batch<T>(settings: BatchSettings, serverAuthority?: string): Q.Promise<BatchResponseItem<T>>

/**
 * The request options.
 */
export const enum RequestOptions {
    /**
     * Default behavior.
     *    - Defaults to foreground request
     *    - Calls are batched to ARM every 100 ms
     *    - Any ServerTimeout (503) failures for foreground GET requests
     *      are automatically retried by calling the API directly wihtout batch
     *    - Responses are not cached
     */
    None = 0,

    /**
     * Make the batch call on the next tick.
     * DebounceNextTick takes precedence over Debounce100Ms.
     */
    DebounceNextTick = 1,

    /**
     * Include the request in a batch call that is made after a 100ms delay.
     * Debounce100Ms takes precedence over DebounceOneMinute
     */
    Debounce100ms = 2, // DebounceNextTick << 1,

    /**
     * Sets this request to run in the background.
     * Background requests are batched every 60 seconds.
     */
    DebounceOneMinute = 4, // Debounce100ms << 1,

    /**
     * Forces a retry for any failure returned (statusCode >= 400) regardless of the HTTP method.
     */
    RetryForce = 8, // DebounceOneMinute << 1,

    /**
     * Skips the default retry.
     * SkipRetry takes precedence over ForceRetry if both are set.
     */
    RetrySkip = 16, // RetryForce << 1,

    /**
     * Caches the response for GET requests for 10 seconds.
     */
    ResponseCacheEnabled = 32, // RetrySkip << 1,

    /**
     * Skips caching the response for GET requests.
     */
    ResponseCacheSkip = 64, // ResponseCacheEnabled << 1,
}

/**
 * The settings for the batch call.
 */
export interface BatchSettings {
    /**
     * The request options.
     */
    options?: RequestOptions;

    /**
     * The telemetry header to set.
     */
    setTelemetryHeader?: string;

    /**
     * The http method to use. Defaults to GET.
     */
    type?: string;

    /**
     * The URI to call.
     */
    uri: string;
}

export interface BatchResponseItem<T> {
    /**
    * The response content. Can be success or failure.
    */
    content: T;

    /**
    * The response headers.
    */
    headers: StringMap<string>;

    /**
    * The response status code.
    */
    httpStatusCode: number;
}
```