// Bypass the libc integrity check, then hook the native decrypt function.
//
// On Android ARM64, Frida 17.18 redirects the export with:
//   ldr xN, #8
//   ret xN
// The app only checks for `br xN`, so its trampoline check misses this hook.

(function () {
    const CHECK_LIBC_TEXT_OFFSET = 0xd60;
    const DECRYPT_EXPORT =
        "Java_org_owasp_mastestapp_MastgTest_decryptNativeSecret";

    let installed = false;
    let checkLibcTextReplacement = null;
    let decryptListener = null;

    function install() {
        if (installed) {
            return true;
        }

        const module = Process.findModuleByName("libnativekey.so");
        if (module === null) {
            return false;
        }

        // Skip the libc .text checksum and its pending Java exception.
        const checkLibcText = module.base.add(CHECK_LIBC_TEXT_OFFSET);
        checkLibcTextReplacement = new NativeCallback(function () {
            console.log("[bypass] checkLibcText() -> true");
            return 1;
        }, "int", ["pointer"]);
        Interceptor.replace(checkLibcText, checkLibcTextReplacement);
        console.log("[bypass] checkLibcText bypassed at " + checkLibcText);

        Interceptor.attach(Module.getGlobalExportByName("open"), {
            onEnter(args) {
                console.log(`[bypass] open(${args[0].readCString()})`);
            },
        });

        // Hook the exported JNI decrypt function.
        const decryptNativeSecret = module.getExportByName(DECRYPT_EXPORT);
        decryptListener = Interceptor.attach(decryptNativeSecret, {
            onEnter() {
                console.log("[bypass] decryptNativeSecret() called");
            },
            onLeave(retval) {
                if (retval.isNull()) {
                    console.log("[bypass] decryptNativeSecret() returned NULL");
                    return;
                }

                try {
                    const env = Java.vm.getEnv();
                    const length = env.getArrayLength(retval);
                    const bytes = env.getByteArrayElements(retval, ptr(0));
                    try {
                        console.log("[bypass] plaintext: " + bytes.readUtf8String(length));
                    } finally {
                        env.releaseByteArrayElements(retval, bytes, 2); // JNI_ABORT
                    }
                } catch (e) {
                    console.log("[bypass] unable to read returned jbyteArray: " + e);
                }
            }
        });
        console.log("[bypass] decryptNativeSecret hooked at " + decryptNativeSecret);

        installed = true;
        return true;
    }

    if (!install()) {
        console.log("[*] Waiting for libnativekey.so to load...");
        const timer = setInterval(function () {
            if (install()) {
                clearInterval(timer);
            }
        }, 100);
    }
})();
