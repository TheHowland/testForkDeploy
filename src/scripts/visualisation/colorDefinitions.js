class ColorDefinitions {

    keyYellow = "#FFC107";
    keyLight = "white";
    keyDark = "black";


    currentForeground = this.keyLight;
    currentBackground = this.keyDark;


    prevNextBtnBackgroundColor = this.keyDark;

    // Dark/Light mode color definitions
    foregroundColor = this.keyLight;
    backgroundColor = this.keyDark;
    bsColorSchemeLight = "light";
    bsColorSchemeDark = "dark";

    bootstrapDark = "#212529";
    bootstrapWhite = "#f8f9fa";
    languagesDarkBg = "#33393f";
    languagesLightBg = "#efefef";

    lightModeSvgStrokeColor = this.keyDark;
    darkModeSvgStrokeColor = this.keyLight;

    setDarkModeColors() {
        this.currentForeground = this.keyLight;
        this.currentBackground = this.keyDark;
    }
    setLightModeColors() {
        this.currentForeground = this.keyDark;
        this.currentBackground = this.keyLight;
    }
}