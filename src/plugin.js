import AlBhedify from './albhedify'

$alBhedify = null;

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
