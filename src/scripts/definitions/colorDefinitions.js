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
    currentHeadingsForeground = this.keyYellow;  // yellow in darkmode, black in lightmode
    currentBackground = this.keyDark;
    currentBsBackground = this.bootstrapDark;

    prevNextBtnBackgroundColor = this.keyYellow;

    bsColorSchemeLight = "light";
    bsColorSchemeDark = "dark";

    lightModeSvgStrokeColor = this.keyDark;
    darkModeSvgStrokeColor = this.keyLight;

    setDarkModeColors() {
        this.currentForeground = this.keyLight;
        this.currentHeadingsForeground = this.keyYellow;
        this.currentBackground = this.keyDark;
        this.currentBsBackground = this.bootstrapDark;
    }
    setLightModeColors() {
        this.currentForeground = this.keyDark;
        this.currentHeadingsForeground = this.keyDark;
        this.currentBackground = this.keyLight;
        this.currentBsBackground = this.bootstrapWhite;
    }
}