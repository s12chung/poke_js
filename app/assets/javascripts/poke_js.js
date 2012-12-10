//http://stackoverflow.com/questions/6167805/using-rails-3-1-where-do-you-put-your-page-specific-javascript-code
POKE = {
    blank: function(o) {
        return typeof o === "undefined" || o === null;
    },
    present: function(o) {
        return !POKE.blank(o);
    },
    get_or_create: function(namespace, o) {
        if (POKE.blank(o))
            o = APP;
        if (POKE.blank(o[namespace]))
            o[namespace] = {};
        return o[namespace];
    },
    define: function(namespace, hash, o) {
        var o_namespace = POKE.get_or_create(namespace, o);
        return $.extend(o_namespace, hash);
    },


    exec_all: function(controller, format, action) {
        POKE.exec("app", format);
        POKE.exec(controller, format);
        POKE.exec(controller, format, action);
    },
    exec: function(controller, format, action) {
        var ns = APP,
            action = (action === undefined) ? "init" : action;

        if (controller !== "" && ns[controller] &&
            format !== "" && ns[controller][format]) {
            var funct = ns[controller][format][action],
                params = ns[controller][format][action + "_params"];

            if ($.isFunction(funct))
                funct(params);
        }
    },
    init: function() {
        var $body = $('body');
        POKE.exec_all($body.data("controller"), "html", $body.data("action"));
    }
};

if (POKE.blank(window["APP"]))
    APP = {};
$(POKE.init);