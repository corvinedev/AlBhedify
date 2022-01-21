//==============================================================================
// AlBhedify - v1.1.0
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
