# AlBhedify

*An RPG Maker MZ plugin that translates text into an in-game language a la FFX's Al Bhed*

### Example

In the following example, all plugin settings are set to the defaults.

In any message where regular control codes (such as color codes or actor names) are available, text surrounded by the `Open Tag` and `Close Tag` will get "AlBhedified". In this case, both the `Open Tag` and `Close Tag` are set to the backtick character `` ` ``, and the `Language Map` is set to the default values (FFX's Al Bhed language).

![Use tags in the editor](img/sample-default-editor.png)

![AlBhedified text](img/sample-albhedified.png)

To learn a letter, the plugin command `Learn Letter` is used. In this example, the regular letter `E` is learned.

![Learn the letter E](img/sample-learn-e.png)

Now the letter `E` will no longer be AlBhedified. The message from before will show up in-game with the regular letter, and it will no longer be highlighted.

![E has been learned](img/sample-translated-e.png)

## Caveats

- This plugin should probably be placed before any other plugins that modify text and window behavior.
- Some control codes can be used inside translation tags. These include:
  - Variable value: `\V[n]`
  - Actor name: `\N[n]`
  - Party member name: `\P[n]`
  - Currency unit: `\G`
  - Increase font size: `\{`
  - Decrease font size: `\}`
- Some other control codes can **NOT** be used inside translation tags, because they will get AlBhedified and won't work. These include:
  - Color code: `\C[n]`
  - Set position: `\PX[n]` and `\PY[n]`
  - Set font size: `\FS[n]`
  - Display icon: `\I[n]`
