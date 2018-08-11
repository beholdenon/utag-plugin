window.bl = window.bl || {};

(function(ns) {
  
    // private variables
    // whether or not connection to coremetrics library is succesful
    var libraryFound = false;

    // env either production or dev
    var env = window.ENV_CONFIG || "dev";

    // get current host
    var host = window.location.host;

    // production urls
    var PRODUCTION_URLS = [
        "fashion.bloomingdales.com",
        "www.bloomingdales.com",
        "m.bloomingdales.com"
    ];

    // valid tag types
    var validEventTypes = [ "view", "link" ];

    //plugin defaults
    var options = {

        // default page id's for onLoad tags
        page_paths: {},
        
        // control whether or not onLoad page tags fire
        call_page_tags: true,

        // use html attributes for element tags
        use_attribute_tags: true,

        // the name of the attribute tags
        attribute_tag: "utag"
    };

    // private method to combine defaults and options
    function extend(a, b){
        for(var key in b)
        if(b.hasOwnProperty(key))
        a[key] = b[key];
        return a;
    }
    
    // forEach method, could be shipped as part of an Object Literal/Module
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };
    // init called when plugin instance is created 
    function init() {
        // check to see if  library connected
        libraryFound = checkForLibrary();
        if(libraryFound) {
            log("Library Initiated");

            // intial coremetrics setup
            initEnvironment();

            // listen for html elements tags
            initAttributeListener();

            // call on load page event
            initPageLoadCall();
        }
        else {
            // could not connect to coremetrics
            log("ERROR: Could not find coremetrics library (from init method)");
        }
    }

    // test connection to bloomies and  coremetrics
    function checkForLibrary() {
        try {
            if(window.utag) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            log("ERROR: Could not find  library (from checkForLibrary method): " + e);
            return false;
        }
    }

    // setup dev or production environment
    function initEnvironment() {
        if (env === "dev") {
        }
        else if (env === "production") {

        }
        else {
            throw "ERROR: Unidentified env variable (from initEnvironment method)";
        }
    }

    // setup
    function initAttributeListener() {
        if(options.use_attribute_tags) {
            var el = document.querySelectorAll("[" + options.attribute_tag + "]");

            forEach(el, function (index, value) {
                value.onclick = function(){
                    fireTag("link", {
                        event_name: value.getAttribute(options.attribute_tag)
                    });
                };
            });
        }
        
    }

    // setup page id's firing on page load
    function initPageLoadCall() {
        if(options.page_paths != {} && options.call_page_tags) {
            var page = options.page_paths[path()];
            if(page !== undefined) {
               fireTag("view", {
                    page_type: "marketing",
                    page_name: page
                });
            }
        }
    }

    // logger
    function log(msg) {
        if (window.console && PRODUCTION_URLS.indexOf(host) === -1) {
            console.log(msg);
        }
    }

    // check the tags passed
    function checkTag(type, params) {
        if(!libraryFound) {
            log("ERROR: Library not found");
            return false;
        }
        else if(type === undefined || type === "") {
            log("ERROR: No type defined");
            return false;
        }
        else if(validEventTypes.indexOf(type) === -1) {
            log("ERROR: Invalid tag type");
            return false;
        }
        else if(params === undefined || params === {}) {
            log("ERROR: Params not set");
            return false;
        }
        return true;
    }

    // method to fire tags (cat is optional)
    function fireTag(type, params) {
        if(checkTag(type, params)) {
            log("fireTag: Type: " + type + " Params: " + JSON.stringify(params));
            window.utag[type](params);
        }
    }

    // return current directory
    function path() {
        var urlArr = window.location.pathname.split("/");
        if( urlArr[urlArr.length - 1] === "" ) {
            return urlArr[urlArr.length - 2];
        }
        else {
            return urlArr[urlArr.length - 1];
        }
        return window.location.pathname;
    }

    // public methods
    ns.init = function(settings) {
        options = extend(options, settings);
        init();
    };
    ns.fireTag = function(type, params) {
        fireTag(type, params);
    };
    ns.path = function() {
        return path();
    };
    ns.libraryFound = function () {
        return libraryFound;
    };
})(window.bl.utag = window.bl.utag || {});