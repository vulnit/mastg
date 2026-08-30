This guide defines how to write and use Frida scripts in MASTG demos. Scripts live alongside the demo content and are executed by `run.sh` to produce the demo's Observation output.

**Note:** Prefer Frooky hooks over Frida scripts where possible, as they require less code. See [Frooky hook configuration](frooky.md) for details.

## Location and naming

- Place scripts inside the demo folder and name them `script.js` unless multiple scripts are needed.
- If multiple scripts are required, use specific names (for example, `hook_ssl.js`, `hook_keystore.js`) and document which to run in the demo Steps and `run.sh`.

Examples:

- `demos/ios/MASVS-AUTH/MASTG-DEMO-0042/script.js`
- `demos/android/MASVS-CODE/MASTG-DEMO-0158/script.js`

## Runtime and invocation

- Typical spawn usage in `run.sh`:
    - `frida -U -f <bundle_or_package_id> -l script.js -o output.txt`

## Coding conventions

- Keep scripts self-contained (no external module imports).
- Keep output concise and deterministic for Evaluation parsing.
- Check class/method existence; log a clear message if missing.
- Avoid global side effects; scope variables within hooks/functions.
- Logging: prefer `console.log()`; add short section headers only when helpful.
- Backtraces: use `DebugSymbol.fromAddress` and cap lines.
- In `onEnter/onLeave`, capture context first (for example, `const ctx = this.context;`) before using nested arrow functions.

## Use and Validation of Frida APIs

When writing new Frida scripts for MASTG demos, always validate against the latest [frida-gum typings](https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/refs/heads/master/types/frida-gum/index.d.ts) (human-readable version: [JavaScript API](https://frida.re/docs/javascript-api/)).

Consider the following key changes introduced in Frida 17 and if you encounter any of the old APIs in existing scripts, update them accordingly:

| Area                       | Before Frida 17                                                                              | Frida 17 and later                                                                                                             | Notes                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Global exports             | `Module.getExportByName(null, "open")` and `Module.findExportByName(null, "open")`           | `Module.getGlobalExportByName("open")` and `Module.findGlobalExportByName("open")`                                             | Global lookups are now explicit. `get*` throws if missing, `find*` returns null.                  |
| Global symbol special case | `Module.getSymbolByName(null, "open")`                                                       | `Module.getGlobalExportByName("open")`                                                                                         | Only the null module symbol case maps to global exports. Not a general symbol replacement.        |
| Module exports             | `Module.getExportByName("libc.so", "open")` and `Module.findExportByName("libc.so", "open")` | `Process.getModuleByName("libc.so").getExportByName("open")` and `Process.getModuleByName("libc.so").findExportByName("open")` | Static helpers removed. Use a `Module` instance. `get*` throws, `find*` returns null.             |
| Module symbols             | `Module.getSymbolByName("libart.so", "ExecuteNterpImpl")`                                    | `Process.getModuleByName("libart.so").getSymbolByName("ExecuteNterpImpl")`                                                     | Symbol lookup still exists but only on `Module` instances, not statically and not on pointers.    |
| Module base                | `Module.getBaseAddress("libc.so")`                                                           | `Process.getModuleByName("libc.so").base`                                                                                      | Base address helpers removed. Base is a property of a `Module` instance.                          |
| Module initialization      | `Module.ensureInitialized("libobjc.A.dylib")`                                                | `Process.getModuleByName("libobjc.A.dylib").ensureInitialized()`                                                               | Static initializer removed. Instance method ensures initializers have run for that module.        |
| Enumeration                | `Process.enumerateModules({ onMatch, onComplete })`                                          | `Process.enumerateModules()`                                                                                                   | Callback based enumeration removed. Now returns arrays. Same model for threads and ranges.        |
| Memory access | `Memory.read*`, `Memory.write*`, `Memory.readUtf8String`, `Memory.writeUtf8String`, `Memory.readByteArray`, `Memory.writeByteArray` | `ptr.read*`, `ptr.write*`, `ptr.readUtf8String()`, `ptr.writeUtf8String()`, `ptr.readByteArray()`, `ptr.writeByteArray()` | All memory read and write helpers moved onto `NativePointer` instances, including numeric reads and writes, strings, and byte arrays. The `Memory.*` forms are replaced by instance methods on the pointer you want to access. |

Here's one example of updating code for Frida 17 that can serve as a reference: <https://patch-diff.githubusercontent.com/raw/AloneMonkey/frida-ios-dump/pull/200.diff>.

**Using ObjC and Java runtime bridges in Frida 17+:**

The Frida scripts we're creating for MASTG demos are meant to be run with the Frida CLI, so you can keep using the `ObjC` and `Java` runtime bridges as before. However, be aware that starting with Frida 17, these APIs are no longer part of the [frida-gum typings](https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/refs/heads/master/types/frida-gum/index.d.ts). The Frida CLI pre-bundles these runtime bridges for you.

For more details, see:

- <https://mas.owasp.org/MASTG/tools/generic/MASTG-TOOL-0031/#frida-17>
- <https://frida.re/news/2025/05/17/frida-17-0-0-released/>

## Reusing External Frida Code

Treat external Frida code, including CodeShare scripts, as untrusted code.

- Inspect the complete source before you reuse it.
- Confirm that its license permits reuse, and preserve all required license notices.
- Copy only the parts that the demo requires. Do not load code from an external source at runtime.
- Add the source URL and author attribution in a comment at the start of the script.
- Test the copied code with the supported Frida version and the target app.

Example:

```js
// SOURCE: https://codeshare.frida.re/@TheDauntless/disable-flutter-tls-v1/

// Configuration object containing patterns to locate the ssl_verify_peer_cert function for different platforms and architectures.
var config = {
    "ios":{
        "modulename": "Flutter",
        "patterns":{
            "arm64": [
                ...
```

## Logging and outputs

- Redirect script output to `output.txt` from `run.sh`.
- Keep logs minimal and structured so Observation/Evaluation can reference them directly.
- Cap list outputs (for example, backtraces) to keep diffs stable.

## Safety and troubleshooting

- Use try/catch around complex hooks to prevent script termination.
- If a symbol/method is missing, log and continue.
- Spawn vs attach: use `-f` for early instrumentation when needed.
- Consider stripped binaries and symbol resolution; prefer Objective-C/Java-level hooks over raw native symbols where possible.
- Version compatibility: ensure the Frida client on the host and the device runtime (for example, `frida-server` on Android or an injected runtime on iOS) use the same major version. For reproducible tests, prefer the exact same version on both sides.
