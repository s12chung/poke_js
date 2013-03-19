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
        if (!$.isArray(levels)) levels = [levels.controller, levels.format, levels.action];
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

    create_namespace: function(namespace) {
        var current_level = window;
        $.each(namespace.split("."), function(index, level) {
            if (!$.isPlainObject(current_level[level])) current_level[level] = {};
            current_level = current_level[level];
        });
    },

    exec_all: function(params) {
        POKE.exec("application", params.format, "before", params);
        POKE.exec(params.controller, params.format, "before", params);
        POKE.exec("application", params.format, params.action, params);
        POKE.exec(params.controller, params.format, params.action, params);
        POKE.exec(params.controller, params.format, "after", params);
        POKE.exec("application", params.format, "after", params);
    },
    exec: function(controller, format, action, params) {
        var action_namespace = APP.traverse_namespace([controller, format, action]);
        if ($.isFunction(action_namespace)) action_namespace(params);
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