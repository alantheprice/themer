(function(global) {
    "use strict";

    Themer.THEME_KEY = "KEY_FOR_STORING_THE_THEME_IN_LOCAL_STORAGE";
    Themer.DEFAULT_LINK_URL = "./theme.css";

    Themer.DEFAULTS = {
        primary: "#123456",
        secondary: "#897456",
        tertiary: "#897456",
        "text-primary": "#222222",
        "text-secondary": "#777777",
        "text-tertiary": "#782290"
    };

    function Themer() {

    }

    Themer.prototype.addDefaultTheme = function () {
        let linkTag = this.getLinkTag();
        linkTag.href = Themer.DEFAULT_LINK_URL;
    };

    Themer.prototype.addCustomTheme = function(theme) {
        let themeAsString = this.convertThemeToString(theme);
        console.log(themeAsString);
        let blob = new Blob([themeAsString], {type: 'text/css'});
        let linkTag = this.getLinkTag();
        linkTag.href = window.URL.createObjectURL(blob);
    };

    Themer.prototype.getLinkTag = function() {
        var link = global.document.getElementById("theme");
        if (link) {
            return link;
        }
        link = document.createElement('link');
        link.id = "theme";
        link.rel = "stylesheet";
        global.document.head.appendChild(link);
        return link;
    }

    Themer.prototype.convertThemeToString = function(theme) {
        let keys = Object.keys(theme);
        return keys.map((key) => {
            let value = theme[key];
            let themeName = "theme-" + key;
            let propName = (key.indexOf("text") === -1) ? "color" : "background-color";
            let finalVal = [propName, value].join(": ");
            return [".", themeName, " {", finalVal, "}"].join(""); 
        }).join("\n");
    };

    Themer.prototype.getTheme = function() {
        // This could be an api call that loads the correct theme, 
        // to emulate that experience, we will just be loading a theme from localStorage.
        let theme = global.localStorage.getItem(Themer.THEME_KEY)
        if (theme) {
            theme = JSON.parse(theme);
        }
        return Promise.resolve(theme);
    };

    Themer.prototype.setTheme = function(theme) {
        this.addCustomTheme(theme);
        let themeStr = JSON.stringify(theme);
        global.localStorage.setItem(Themer.THEME_KEY, themeStr);
    };

    // Add to global, should maybe do this differently in a prod environment.
    global.Themer = Themer;


    global.addEventListener("DOMContentLoaded", () => {
        let themer = new Themer();
        themer.getTheme()
        .then((theme) => {
            if (!theme) {
                themer.addDefaultTheme();
                return;
            }
            themer.addCustomTheme(theme);
        })
        setupEvents();
    });

    function setupEvents() {
        let primary = global.document.getElementById("primary");
        let secondary = global.document.getElementById("secondary");
        let tertiary = global.document.getElementById("tertiary");
        let textPrimary = global.document.getElementById("text-primary");
        let textSecondary = global.document.getElementById("text-secondary");
        let textTertiary = global.document.getElementById("text-tertiary");

        global.document.getElementById("save-button").addEventListener("click", () => {
            //TODO: save new colors
        });

    }


})(window);