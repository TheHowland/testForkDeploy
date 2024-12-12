class ColorDefinitions {

    keyYellow = "#FFC107";
    keyLight = "white";
    keyDark = "black";
    keyGreyedOut = "#b1b1b1";
    bootstrapDark = "#212529";
    bootstrapWhite = "#f8f9fa";
    languagesDarkBg = "#33393f";
    languagesLightBg = "#efefef";


    currentForeground = this.keyLight;
    currentBackground = this.keyDark;
    currentBsBackground = this.bootstrapDark;

    prevNextBtnBackgroundColor = "#808080";

    bsColorSchemeLight = "light";
    bsColorSchemeDark = "dark";

    lightModeSvgStrokeColor = this.keyDark;
    darkModeSvgStrokeColor = this.keyLight;

    setDarkModeColors() {
        this.currentForeground = this.keyLight;
        this.currentBackground = this.keyDark;
        this.currentBsBackground = this.bootstrapDark;
    }
    setLightModeColors() {
        this.currentForeground = this.keyDark;
        this.currentBackground = this.keyLight;
        this.currentBsBackground = this.bootstrapWhite;
    }
}