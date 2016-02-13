# Dojo Keyboard Shortcuts
Dojo Keyboard Shortcuts is an input capture module for Dojo.
It is easy to pick up and integrated with any Dojo Application.

Whenever your application needs to detect custom shortcuts this module is for you.

### Great! So how do I use it?
- Install with [Bower](http://bower.io) `bower dojo-keyboard-shortcuts`
- Simply describe your shortcuts in [shortcuts.js](shortcuts.js)
- Subscribe to topic `keyboardShortcuts:combo`.
- Now, whenever a shortcut is being pressed, a message is returned to the subscriber.

### A few extra bits of info
- A common set of keycodes based on English keyboard in included in [keysJs.js](keysJs.js).
- By default detection is not active for textarea or input tags.
- You can modify or define additional rules in [keyboardShortcutsMixin.js](keyboardShortcutsMixin.js).
- Messages always contain an identifier with its keys.

### How do I run the example?
- First install all dependecies in 'dojo-keyboard-shortcuts' folder using:
 - `npm install`
 - `npm bower`
- Now runs your local server and open the example:
 - `gulp connect`
 - `gulp open`
- Open Developer Console to see the detection in action.

