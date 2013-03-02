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

    traverse_namespace: function(namespace, levels) {
        if (typeof levels === "undefined") levels = [POKE.controller, POKE.format, POKE.action];
        levels = POKE.formatted_levels(levels);

        var current_level = namespace;
        var level;
        for (var i=0;i<levels.length;i++) {
            level = levels[i];
            current_level = current_level[level];
            if (typeof current_level === "undefined") return undefined;
        }
        return current_level;
    },
    formatted_levels: function(levels) {
        var formatted_levels = [];
        var level;
        for (var i=0;i<levels.length;i++) {
            level = levels[i];
            formatted_levels = formatted_levels.concat(level.split('/'));
        }
        return formatted_levels;
    },

    exec_all: function(controller, format, action) {
        var params = APP.traverse_namespace([controller, format, action + "_params"]);
        POKE.exec("application", format, "before", params);
        POKE.exec(controller, format, "before", params);
        POKE.exec(controller, format, action, params);
        POKE.exec(controller, format, "after", params);
        POKE.exec("application", format, "after", params);
    },
    exec: function(controller, format, action, params) {
        var action_namespace = APP.traverse_namespace([controller, format, action]);
        if ($.isFunction(action_namespace)) action_namespace(params);
    },
    init: function() {
        var $body = $('body');
        POKE.exec_all(POKE.controller, "html", POKE.action);
    }
};

if (POKE.blank(window["APP"])) {
    APP = {
        namespace_string: function(namespace_string) {
            return "APP." + namespace_string;
        },
        get_or_create: function(namespace_string) {
            return POKE.define(APP.namespace_string(namespace_string));
        },
        define: function(namespace_string, definition) {
            return POKE.define(APP.namespace_string(namespace_string), definition);
        },
        traverse_namespace: function(levels) {
            return POKE.traverse_namespace(APP, levels);
        }
    };
}
$(POKE.init);
$(document).on('page:change', POKE.init);