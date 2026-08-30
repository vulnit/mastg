# Technical Writing Examples

## Technical explanation

### Before

> It is important to note that the diagnostics command does not necessarily initiate a new analysis, as it is primarily designed to surface any diagnostic information that may already have been collected during a previous file modification operation.

### After

> The diagnostics command does not start a new analysis. It returns diagnostics collected after an earlier file change.

The rewrite removes filler and keeps the original behavior.

## Preserve uncertainty

### Before

> The request may have failed because the client possibly sent an unsupported data format.

### After

> The request may have failed. The client may have sent an unsupported data format.

The rewrite keeps both uncertain claims. It does not report a confirmed failure or cause.

## Agent instruction

### Before

> Once the test process has completed, review its output and then make the necessary changes if any failures were detected.

### After

> Wait for the test process to finish. Review the output. If a test failed, make the necessary changes.

The rewrite separates each action and keeps the condition explicit.

## Remove unsupported claims

### Before

> Our robust cache seamlessly eliminates most expensive requests and dramatically improves performance.

### After

> The cache can reduce repeated requests. Measure the effect in the target workload.

The rewrite removes unsupported quality and performance claims. It keeps the limited claim that the cache can reduce repeated requests.
