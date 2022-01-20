//==============================================================================
// AlBhedify - v1.0.1
//==============================================================================
/*:
 * @target MZ
 * @plugindesc Enables translation to an in-game language a la FFX's Al Bhed
 * @author corvinedev
 * @url https://github.com/corvinedev/AlBhedify
 *
 * @param Open Tag
 * @type string
 * @desc Opening tag for translation.
 * @default `
 *
 * @param Close Tag
 * @type string
 * @desc Closing tag for translation.
 * @default `
 *
 * @param Language Map
 * @type struct<LanguageMap>
 * @desc Translations from regular letters to AlBhedified letters.
 * ("Name" = Regular, "Value" = AlBhedified)
 *
 * @param Use Colors
 * @type boolean
 * @desc Highlight letters that have been AlBhedified?
 * @default true
 *
 * @param Highlight Color
 * @parent Use Colors
 * @type number
 * @desc Color code used to highlight AlBhedified letters.
 * @default 2
 * @min 0
 *
 * @param Normal Color
 * @parent Use Colors
 * @type number
 * @desc Normal color code - used for regular letters that are no longer AlBhedified. This should probably always be 0.
 * @default 0
 * @min 0
 *
 * @command learn
 * @text Learn Letter
 * @desc Learn the translation for a regular letter. This letter will no longer be AlBhedified in translations.
 *
 * @arg letter
 * @text Letter
 * @desc The regular letter to learn. This letter will no longer be AlBhedified in translations.
 *
 * @command learnMulti
 * @text Learn Multiple Letters
 * @desc Learn the translations for many regular letters. These letters will no longer be AlBhedified in translations.
 *
 * @arg letters
 * @type string[]
 * @text Letters
 * @desc A list of regular letters to learn. Each row can contain 1 letter.
 *
 * @command forget
 * @text Forget Letter
 * @desc Forget the translation for a regular letter. This letter will be AlBhedified in translations.
 *
 * @arg letter
 * @text Letter
 * @desc The regular letter to forget. This letter will be AlBhedified in translations.
 *
 * @command forgetMulti
 * @text Forget Multiple Letters
 * @desc Forget the translations for many regular letters. These letters will be AlBhedified in translations.
 *
 * @arg letters
 * @type string[]
 * @text Letters
 * @desc A list of regular letters to forget. Each row can contain 1 letter.
 *
 * @command color
 * @text Set Color Options
 * @desc Set and modify options for highlighting AlBhedified letters.
 *
 * @arg useColor
 * @text Use Color
 * @type boolean
 * @desc Highlight letters that have been AlBhedified?
 *
 * @arg highlight
 * @text Highlight Color
 * @type number
 * @desc Color code used to highlight AlBhedified letters.
 * @min 0
 *
 * @arg normal
 * @text Normal Color
 * @type number
 * @desc Normal color code - used for regular letters that are no longer AlBhedified. This should probably always be 0.
 * @min 0
 *
 * @command tags
 * @text Set Tags
 * @desc Set open and close tags for translation.
 *
 * @arg openTag
 * @text Open Tag
 * @desc Opening tag for translation.
 *
 * @arg closeTag
 * @text Close Tag
 * @desc Closing tag for translation.
 *
 * @command isKnown
 * @text Letter Known?
 * @desc Set a switch depending on whether or not a letter's translation is known.
 *
 * @arg letter
 * @text Letter
 * @desc The regular letter to check for.
 *
 * @arg switch
 * @text Switch
 * @type switch
 * @desc Set this switch ON if the regular letter is known (i.e. it's not getting AlBhedified anymore), otherwise OFF.
 *
 * @command areMultiKnown
 * @text Multiple Letters Known?
 * @desc Set a switch depending on whether or not the translations for multiple letters are known.
 *
 * @arg letters
 * @type string[]
 * @text Letters
 * @desc A list of regular letters to check for. Each row can contain 1 letter.
 *
 * @arg switch
 * @text Switch
 * @type switch
 * @desc Set this switch ON if listed regular letters are known (i.e. not getting AlBhedified anymore), otherwise OFF.
 *
 * @help
 * ============================================================================
 * AlBhedify - v1.0.1
 * ============================================================================
 * Translate regular letters into an in-game language a la FFX's Al Bhed. This
 * plugin should probably go before any other plugins that modify message
 * boxes.
 *
 * Text contained between the open tag and close tag will be translated based
 * on which letters have been "learned". Any letter that hasn't been learned
 * will be "AlBhedified" into its corresponding letter in the language map.
 *
 * Set the language map parameter to define how regular letters should get
 * AlBhedified into letters in your in-game language. By default, the language
 * map is set to FFX's Al Bhed language.
 *
 * You can also choose whether or not AlBhedified letters should be colored,
 * and which color code to use for this.
 *
 * Please see the documentation at https://github.com/corvinedev/AlBhedify for
 * more information on how to use this plugin.
 *
 * Some control codes can be used between the open and close tags, such as
 * variables (\V[n]), actor names (\N[n]), party member names (\P[n]), and
 * currency unit (\G).
 *
 * However, some other control codes will NOT work in translations, such as
 * color changes (\C[n]), positional changes (\PX[n] and \PY[n]), and font
 * size controls (\FS[n]). These control codes should be placed outside of the
 * open and close tags for translation, otherwise they will get AlBhedified and
 * will not work.
 */

$alBhedify = null;

function AlBhedify() {
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

(function () {
    PluginManager.registerCommand('AlBhedify', 'learn', (args) => {
        $alBhedify.learnTranslation(args.letter);
    });

    PluginManager.registerCommand('AlBhedify', 'learnMulti', (args) => {
        for (let letter of args.letters) {
            $alBhedify.learnTranslation(letter);
        }
    });

    PluginManager.registerCommand('AlBhedify', 'forget', (args) => {
        $alBhedify.forgetTranslation(args.letter);
    });

    PluginManager.registerCommand('AlBhedify', 'forgetMulti', (args) => {
        for (let letter of args.letters) {
            $alBhedify.forgetTranslation(letter);
        }
    });

    PluginManager.registerCommand('AlBhedify', 'color', (args) => {
        $alBhedify.setColorOptions(args);
    });

    PluginManager.registerCommand('AlBhedify', 'isKnown', (args) => {
        $alBhedify.isLetterKnown(args.letter, args.switch);
    });

    PluginManager.registerCommand('AlBhedify', 'areMultiKnown', (args) => {
        $alBhedify.areLettersKnown(args.letters, args.switch);
    });

    PluginManager.registerCommand('AlBhedify', 'tags', (args) => {
        $alBhedify.setTags(args.openTag, args.closeTag);
    });

    //==========================================================================
    // DataManager
    //==========================================================================
    // Initialize translation plugin.
    //--------------------------------------------------------------------------
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
        $alBhedify = new AlBhedify();
    };

    //--------------------------------------------------------------------------
    // Save translation data.
    //--------------------------------------------------------------------------
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.alBhedify = $alBhedify;
        return contents;
    };

    //--------------------------------------------------------------------------
    // Load translation data.
    //--------------------------------------------------------------------------
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.alBhedify) {
            $alBhedify = contents.alBhedify;
            $alBhedify.afterLoad();
        } else {
            console.warn('Could not load AlBhedify data');
        }
    };

    //==========================================================================
    // Window_Base
    //==========================================================================
    // Translate text contained within tags based on which letters are known.
    //--------------------------------------------------------------------------
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        text = text.replace($alBhedify.regex, (_, txt) => (
            $alBhedify.useColors ?
                $alBhedify.translateWithColors(txt) :
                $alBhedify.translate(txt)
        ));
        return text;
    };
})();

/*~struct~LanguageMap:
 * @param A
 * @default Y
 *
 * @param B
 * @default P
 *
 * @param C
 * @default L
 *
 * @param D
 * @default T
 *
 * @param E
 * @default A
 *
 * @param F
 * @default V
 *
 * @param G
 * @default K
 *
 * @param H
 * @default R
 *
 * @param I
 * @default E
 *
 * @param J
 * @default Z
 *
 * @param K
 * @default G
 *
 * @param L
 * @default M
 *
 * @param M
 * @default S
 *
 * @param N
 * @default H
 *
 * @param O
 * @default U
 *
 * @param P
 * @default B
 *
 * @param Q
 * @default X
 *
 * @param R
 * @default N
 *
 * @param S
 * @default C
 *
 * @param T
 * @default D
 *
 * @param U
 * @default I
 *
 * @param V
 * @default J
 *
 * @param W
 * @default F
 *
 * @param X
 * @default Q
 *
 * @param Y
 * @default O
 *
 * @param Z
 * @default W
 */
