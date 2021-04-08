var queryParameters = {}
try {
    var queryStringContent = decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')
    if(queryStringContent) {
        queryParameters = JSON.parse('{"' + queryStringContent + '"}')
        Object.keys(queryParameters).forEach((key) => {
            let numberValue = Number(queryParameters[key])
            if(!isNaN(numberValue)) {
                queryParameters[key] = numberValue
            }
        })
    }
} catch (error) {
    console.error("Could not Parse Query String", error)
}

function createNode(type, className, options) {
    const {html, text, nodes, style} = (options || {})
    var node = document.createElement(type)
    node.className = className
    if(text) node.innerText = text
    if(html) node.innerHTML = html
    if(nodes) nodes.forEach((n) => {
        node.appendChild(n)
    })
    if(style) {
        Object.keys(style).forEach((key) => {
            node.style[key] = style[key]
        })
    }

    return node
}

function setupClient (scopeName, renderCallback) {
    var timerId = null;
    function websocketConnect(){
        var ws = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://')
            + window.location.host);

        ws.onopen = function () {
            console.log("Connection Opened")
            if(timerId !== null) clearInterval(timerId);
            ws.onclose = function () {
                timerId = setInterval(function() {
                    websocketConnect()
                }, 1000);
            };
        };

        ws.onmessage = function (message) {
            var data = JSON.parse(message.data || "{}");
            console.log("message received: ", data);
            renderCallback(data, queryParameters)
        };
    }

    if(scopeName) websocketConnect()
}

console.log("Generic Client Loaded")
