//http://stackoverflow.com/questions/6167805/using-rails-3-1-where-do-you-put-your-page-specific-javascript-code
POKE = {
    blank: function(o) {
        return typeof o === "undefined" || o === null;
    },
    get_or_create: function(namespace_string) {
        var current_namepace = window;
        $.each(namespace_string.split('.'), function(index, level) {
            if (POKE.blank(current_namepace[level]))
                current_namepace[level] = {};
            current_namepace = current_namepace[level];
        });

        return current_namepace;
    },
    define: function(namespace_string, definition) {
        var found_namespace = POKE.get_or_create(namespace_string);
        return $.extend(found_namespace, definition);
    },


    exec_all: function(controller, format, action) {
        POKE.exec("all", format);
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
    APP = {
        namespace_string: function(namespace_string) {
            return "APP." + namespace_string;
        },
        get_or_create: function(namespace_string) {
            return POKE.define(APP.namespace_string(namespace_string));
        },
        define: function(namespace_string, definition) {
            return POKE.define(APP.namespace_string(namespace_string), definition);
        }
    };
$(POKE.init);