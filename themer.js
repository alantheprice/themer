(function(global) {
    "use strict";

    Themer.THEME_KEY = "KEY_FOR_STORING_THE_THEME_IN_LOCAL_STORAGE";
    Themer.DEFAULT_LINK_URL = "./theme.css";

    Themer.DEFAULTS = {
        primary: "#7D839B",
        secondary: "#C8CAD1",
        tertiary: "#72928C",
        "text-primary": "#302E44",
        "text-secondary": "#221E3F",
        "text-tertiary": "#E1D0BD"
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
            let propName = (key.indexOf("text") === -1) ? "background-color" : "color";
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
        setInputValues();
        let [primary, secondary, tertiary] = getElements(["primary", "secondary", "tertiary"]);
        let [textPrimary, textSecondary, textTertiary] = getElements(["text-primary", "text-secondary", "text-tertiary"]);

        global.document.getElementById("save-button").addEventListener("click", () => {
            console.log("save clicked");
            let theme = getThemeFromInput();
            let themer = new Themer();
            themer.setTheme(theme);
        });

        global.document.getElementById("clear-button").addEventListener("click", () => {
            console.log("clear clicked");
            global.localStorage.setItem(Themer.THEME_KEY, null);
            new Themer().addDefaultTheme();
        });

    }

    function getElements(elementIds) {
        return elementIds.map((elementId) => {
             return global.document.getElementById(elementId);
        });
    }

    function setInputValues() {
        let themer = new Themer();
        let currentTheme = themer.getTheme() || {};
        Object.keys(Themer.DEFAULTS).forEach((key) => {
            let element = global.document.getElementById(key);
            element.value = currentTheme[key] || Themer.DEFAULTS[key];
        });
    }

    function getThemeFromInput() {
        return Object.keys(Themer.DEFAULTS).reduce((agg, key) => {
            let element = global.document.getElementById(key);
            agg[key] = element.value || Themer.DEFAULTS[key];
            return agg;
        }, {});
    }


})(window);