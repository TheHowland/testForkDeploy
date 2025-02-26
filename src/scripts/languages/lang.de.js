const german = {
    // Landing page text
    landingPageGreeting:
        "Ein kostenloses Browsertool um<br>" +
        "zu lernen wie Schaltungsnetze vereinfacht werden",
    selectorWaitingNote:
        "Das kann eine Minute dauern",

    keyFeature1heading:
        "Verstehen",
    keyFeature1:
        "Bekomme ein intuitives Gef&uumlhl daf&uumlr, wie Schaltkreise vereinfacht werden",
    keyFeature2heading:
        "Browserbasiert",
    keyFeature2:
        "Du brauchst keine weitere App auf deinem Smartphone, das Tool l&aumluft komplett in deinem Browser",
    keyFeature3heading:
        "Vielfalt",
    keyFeature3:
        "Du kannst nicht nur Widerst&aumlnde nutzen, sondern auch Kondensatoren und Spulen",
    landingPageExplanation1:
        "Es gibt vorhandene Schaltungen die benutzt werden k&oumlnnen. " +
        "Du kannst verschiedene elektrische Komponenten vereinfachen, z.B. " +
        "Widerst&aumlnde, Kondensatoren oder Spulen. " +
        "Schwierigere Netze kombinieren die verschiedenen Elemente. " +
        "Es kann f&uumlr jeden Schritt die Rechnung angezeigt werden, " +
        "sowohl f&uumlr den Gesamtwiderstand, als auch f&uumlr Spannungen und Str&oumlme.",
    landingPageExplanation2:
        "Beim Durchklicken durch die Schritte kannst du sehen wie die Werte zusammengefasst werden. Nachdem die " +
        "Schaltung vereinfacht ist kannst du außerdem sehen wie die Spannungen und Str&oumlme berechnet werden.",
    landingPageExplanation3:
        "Auf der Homepage, dem Cheat Sheet und der Auswahlseite kannst du außerdem deine bevorzugte Sprache einstellen, " +
        "sowie den passenden Ansichtsmodus w&aumlhlen. W&aumlhrend du Schaltungen vereinfachst sind diese Einstellungen " +
        "nicht ver&aumlnderbar.",

    // Selector page text
    selectorHeadings:
        {
            "quick": "SCHNELLSTART",
            "res":  "WIDERSTÄNDE",  // use the ä character because &auml is not rendered correctly here
            "cap": "KONDENSATOREN",
            "ind": "SPULEN",
            "mixed": "GEMISCHTE SCHALTUNGEN",
            "sym": "SYMBOLISCHE RECHNUNG",
        },
    overviewModalBtn:
        "Übersicht",

    // Loading messages
    messages:
        [
            "Lade Schaltungen...",
            "Lade Widerstände...",
            "Lade Kondensatoren...",
            "Lade Spulen...",
            "Irgendwo waren doch noch Widerstände...",
            "Suche Taschenrechner...",
            "Geht ein Widerstand in eine Bar...",
            "Widerstand ist zwecklos...",
        ],

    // Simplifier page text
    // info gif
    closeBtn:
        "Schlie&szligen",
    infoGifHeading:
        "Anleitung",
    infoGifText:
        "Klicke auf die Elemente die du vereinfachen m&oumlchtest und &uumlberpr&uumlfe deine Auswahl mit dem 'check' Button. " +
        "Wenn die Elemente vereinfacht werden k&oumlnnen, siehst du den n&aumlchsten Schritt und kannst dort die n&aumlchsten Elemente ausw&aumlhlen.",
    // next elements container and interactions
    nextElementsHeading:
        "N&aumlchste Elemente",
    showCalculationBtn:
        "Rechnung",
    hideCalculationBtn:
        "Ausblenden",
    showVoltageBtn:
        "Spannung/Strom",
    hideVoltageBtn:
        "Ausblenden",
    firstVCStepBtn:
        "Gesamtstrom",
    solutionsBtn:
        "Alle Werte",
    msgVoltAndCurrentAvailable:
        "Du kannst nun zur&uumlckscrollen und schauen wie die Spannungen und Str&oumlme berechnet werden k&oumlnnen",
    msgShowVoltage:
        "Probiere selbst die Spannungen und Str&oumlme auszurechnen, mit der Annahme, dass",
    msgCongratsFinishedCircuit:
        "Bravo, du hast die Schaltung vereinfacht",
    alertCanNotSimplify:
        "Diese Elemente k&oumlnnen nicht vereinfacht werden",
    alertChooseAtLeastOneElement:
        "W&aumlhle mindestens zwei Elemente",
    alertNotToggleable:
        "Komplexe Elemente k&oumlnnen hier nicht dargestellt werden, siehe Rechnungen",

    // Calculation text
    relationTextParallel:
        "Die Elemente sind parallel zueinander",
    relationTextSeries:
        "Die Elemente sind in Reihe zueinander",
    relationTextNoRelation:
        "Keine Beziehung zwischen den Elementen",

    // Impedance text
    voltageSymbol:
        "U",
    totalSuffix:
        "ges",
    effectiveSuffix:
        "eff",
    theElements:
        "Die Elemente",
    areSimplifiedTo:
        "wurden vereinfacht zu",
    calculationHeading:
        "Rechnung",
    complexImpedanceHeading:
        "Komplexer Widerstand f&uumlr",

    // Voltage Current text
    currentCalcHeading:
        "Berechnen des Stroms f&uumlr",
    currentStaysTheSame:
        "Der Strom bleibt gleich",
    voltageSplits:
        "Die Spannung teilt sich auf",
    voltageStaysTheSame:
        "Die Spannung bleibt gleich",
    currentSplits:
        "Der Strom teilt sich auf",
    backBtn:
        "zur&uumlck",
    onlyImaginaryPart:
        "Rein imagin&aumlr, zur&uumlck zu ",

    // Cheat sheet
    resistanceColHeading:
        "Widerstand R",
    reactanceColHeading:
        "Blindwiderstand X",
    resistorRowHeading:
        "Widerstand R",
    capacitorRowHeading:
        "Kondensator C",
    inductorRowHeading:
        "Spule L",
    subTableSeriesHeading:
        "Serie",
    subTableParallelHeading:
        "Parallel",
    subTableHeading:
        "ZUSAMMENFASSUNGS-FORMELN",
    resReaTableHeading:
        "KOMPLEXER WIDERSTAND",


    /* Data Privacy Page */
    dataPrivacyBackBtn:
        "Zur&uumlck zur Homepage",
    dataPrivacyHeading:
        "Datenschutz",
    dataPrivacyText:
        "",
    legalNoticeHeading:
        "Impressum",

    /* About Page */
    aboutText:
        "<br><br>simplipfy wird von der Hochschule Pforzheim betrieben.<br>" +
        "Die Software wird unter der Leitung von Prof.Dr. Stefan Kray entwickelt und von der Stiftung Innovation in der Hochschullehre gef&oumlrdert.<br>" +
        "Das Tool soll Studierenden und Schülern beim Erlernen von Elektrotechnik-Themen helfen.<br><br>" +
        "Das Projekt ist open-source und kann unter folgendem Link auf GitHub eingesehen werden: <a href='https://github.com/prof-sky/simplipfy'>Github-Repo</a><br><br>" +
        "<h3>Benutzte Bibliotheken</h3>" +
        "<ul>" +
        "<li><a href='https://github.com/prof-sky/lcapy/tree/lcapy-inskale'>Lcapy (adaptiert)</a> [LGPL-2.1 Lizenz]</li>" +
        "<li><a href='https://github.com/prof-sky/simplipfy/tree/main/Schemdraw'>SchemDraw (adaptiert)</a> [MIT Lizenz]</li>" +
        "<li><a href='https://github.com/pyodide/pyodide'>Pyodide</a> [MPL-2.0 Lizenz]</li>" +
        "</ul>"


}
