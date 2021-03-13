function FindProxyForURL(url, host) {
    PROXY = "PROXY 127.0.0.1:8080"

    // Apple.com via proxy
    if (shExpMatch(host,"chat.tobisk.de")) {
        return PROXY;
    }
    if (shExpMatch(host,"mitm.it")) {
        return PROXY;
    }
    if (shExpMatch(host,"kuvo.com")) {
        return PROXY;
    }
    // if (shExpMatch(host,"*.kuvo.com")) {
    //     return PROXY;
    // }
    // Everything else directly!
    return "DIRECT";
}