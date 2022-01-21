export default function AlBhedify() {
    this.initialize();
}

AlBhedify.prototype.initialize = function () {
    const parameters = PluginManager.parameters('AlBhedify');
    this.openTag = String(parameters['Open Tag']);
    this.closeTag = String(parameters['Close Tag']);
    this.regex = this.makeRegex(this.openTag, this.closeTag);
    this.language = this.prepareLanguageMap(parameters['Language Map']);
    this.useColors = (parameters['Use Colors'] === 'true');
    this.color = {
        highlight: parseInt(parameters['Highlight Color']),
        normal: parseInt(parameters['Normal Color']),
    };
    this.map = Object.assign({}, this.language);
};

AlBhedify.prototype.afterLoad = function () {
    this.regex = this.makeRegex(this.openTag, this.closeTag);
};

AlBhedify.prototype.makeRegex = function (openTag, closeTag) {
    openTag = openTag.replace(/\\/, '\x1b');
    openTag = openTag.replace(/([\[\](){}^$*.+?|,\-])/g, (_, c) =>
        `\\${c}`
    );
    closeTag = closeTag.replace(/\\/, '\x1b');
    closeTag = closeTag.replace(/([\[\](){}^$*.+?|,\-])/g, (_, c) =>
        `\\${c}`
    );
    return new RegExp(`${openTag}([\\S\\s]+?)${closeTag}`, 'g');
};

AlBhedify.prototype.prepareLanguageMap = function (languageMap) {
    const language = JSON.parse(languageMap);
    const map = {};
    for (let key in language) {
        map[key] = language[key].trim().toUpperCase().replace(/\\/g, '\x1b');
    }
    return map;
};

AlBhedify.prototype.learnTranslation = function (letter) {
    delete this.map[letter.trim()[0].toUpperCase()];
};

AlBhedify.prototype.forgetTranslation = function (letter) {
    letter = letter.trim()[0].toUpperCase();
    this.map[letter] = this.language[letter];
};

AlBhedify.prototype.setColorOptions = function ({useColor, highlight, normal}) {
    this.useColors = useColor;
    this.color.highlight = highlight;
    this.color.normal = normal;
};

AlBhedify.prototype.setTags = function (openTag, closeTag) {
    this.openTag = openTag;
    this.closeTag = closeTag;
    this.regex = this.makeRegex(openTag, closeTag);
};

AlBhedify.prototype.isLetterKnown = function (letter, switchId) {
    letter = letter.trim()[0].toUpperCase();
    $gameSwitches.setValue(switchId, !this.map[letter]);
};

AlBhedify.prototype.areLettersKnown = function (letters, switchId) {
    let result = false;
    for (let letter of letters) {
        result = !this.map[letter.trim()[0].toUpperCase()];
        if (!result) {
            break;
        }
    }
    $gameSwitches.setValue(switchId, result);
};

AlBhedify.prototype.translate = function (text) {
    return text.split('').map((char) => {
        const charUpper = char.toUpperCase();
        const isUpperCase = charUpper === char;
        const translated = this.map[charUpper] || char;
        return isUpperCase ? translated : translated.toLowerCase();
    }).join('');
};

AlBhedify.prototype.translateWithColors = function (text) {
    const translatedText = text.split('').map((char) => {
        const charUpper = char.toUpperCase();
        const isUpperCase = charUpper === char;
        const translated = this.map[charUpper];
        if (translated) {
            return {
                char: isUpperCase ? translated : translated.toLowerCase(),
                translated: true,
            };
        } else {
            return {
                char,
                translated: false,
            };
        }
    });

    let outputText = '';
    let previousCharTranslated = false;
    for (let char of translatedText) {
        if (char.translated === previousCharTranslated) {
            outputText += char.char;
        } else {
            outputText += (
                char.translated ?
                    `\x1bc[${this.color.highlight}]${char.char}` :
                    `\x1bc[${this.color.normal}]${char.char}`
            );
            previousCharTranslated = char.translated;
        }
    }

    if (previousCharTranslated) {
        outputText += `\x1bc[${this.color.normal}]`;
    }

    return outputText;
};
