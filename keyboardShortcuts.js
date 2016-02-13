define([
    'keyboardShortcutsMixin',
    'keysJs',
    'shortcuts',
    'dojo/topic',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/keys'
], function (
    keyboardShortcutsMixin,
    keysJs,
    shortcuts,
    topic,
    lang,
    on,
    keys
    ) {
    'use strict';
    // module:
    //		keyboardShortcuts
    // summary:
    //      Detects keyboard inputs and match them with some pre-defined shortcuts.
    var _instance,
        utility = {
            findKeysShortcuts: function (a, b, delimiter) {
                //  summary:
                //      Finds keys in shortcut string separated by a delimiter.
                var result = true;
                if (a === b) {
                    result = true;
                }
                if (!a || !b || a.length !== b.length) {
                    result = false;
                }
                var splitA = a.split(delimiter).sort(),
                    splitB = b.split(delimiter).sort();
                if (splitA.length !== splitB.length) {
                    result = false;
                }
                for (var i = 0; i < splitA.length; i++) {
                    if (splitA[i] !== splitB[i] ||
                        (i > 0 && splitA[i] === splitA[i - 1])) {
                        result = false;
                    }
                }
                return result;
            },

        };
    function _KeyboardShortcuts() {
    }
    _KeyboardShortcuts.prototype = {
        // _comboHold: [private] String
        //      Combination of keys (combo) being held.
        _comboHold: null,

        // _map: [private] Object
        //      Keys code being held by the User.
        _map: {},

        init: function () {
            // summary:
            //      Initializes this module and starts processing.
            lang.mixin(this, keyboardShortcutsMixin);
            this._process();
        },
        _process: function () {
            // summary:
            //      Starts module functionalities.
            this._getShortcuts();
            this._addDefaultSearchShortcuts();
            this._search.call(this);
            this._detectUserInput.call(this);
        },
        _getShortcuts: function () {
            // summary:
            //      Gets shortcuts data we want to match.
            this._shortcuts = shortcuts;
        },
        _reset: function () {
            // summary:
            //      Resets internal data.
            this._comboHold = null;
            this._map = {};
        },

        // _searchShortcuts: [private] Object
        //      Contains keys which match the combos we want to find.
        _searchShortcuts: {},

        _search: function () {
            // summary:
            //      Starts to search keys match.
            this._resetSearchShortcuts();
            this._findJsKeysForShortcuts();
        },
        _resetSearchShortcuts: function () {
            // summary:
            //      Resets the list of keys we want to match.
            Object.keys(this._searchShortcuts).forEach(function (keyJs) {
                Object.keys(this._searchShortcuts[keyJs]).forEach(function (prop) {
                    if (prop === 'isActive') {
                        this._searchShortcuts[keyJs][prop] = false;
                    }
                }.bind(this));
            }.bind(this));
        },
        _addDefaultSearchShortcuts: function () {
            // summary:
            //      Add defaults normalized keys using Dojo keys
            this._searchShortcuts[keys.copyKey] = { isActive: false, str: 'copyKey', isConstant: true };
            this._searchShortcuts[keys.SHIFT] = { isActive: false, str: 'shift', isConstant: true };
            this._searchShortcuts[keys.ALT] = { isActive: false, str: 'alt', isConstant: true };
            this._searchShortcuts[keys.DELETE] = { isActive: false, str: 'delete', isConstant: true };
            this._searchShortcuts[keys.BACKSPACE] = { isActive: false, str: 'backspace', isConstant: true };
        },
        _findJsKeysForShortcuts: function () {
            // summary:
            //      Finds a list of keys for shortcuts.
            Object.keys(this._shortcuts).forEach(function (shortcut) {
                var shortCutKeys = this._shortcuts[shortcut].combo.split('-');
                shortCutKeys.forEach(function (shortCutKey) {
                    if (!(shortCutKey in this._searchShortcuts)) {
                        Object.keys(keysJs).forEach(function (keyJs) {
                            if (keysJs[keyJs] === shortCutKey) {
                                this._searchShortcuts[keyJs] = {
                                    isActive: false,
                                    str: shortCutKey,
                                    isConstant: true
                                };
                            }
                        }.bind(this));
                    }
                }.bind(this));
            }.bind(this));
        },
        _getCombo: function (event) {
            // summary:
            //      Gets pressed key combinations and compare them with shortcut combinations.
            this._search.call(this);
            var mapStr = '',
                combo,
                isSameCombo,
                canExecuteCombo;
            // checks each key pressed (map) by the user
            Object.keys(this._map).forEach(function (map) {
                if (map in this._searchShortcuts) {
                    // if the key is a modifier makes it active
                    this._searchShortcuts[map].isActive = true;
                } else {
                    // if the key is not a modifier, add it to the keys for comparisons
                    this._searchShortcuts[map] = {
                        isActive: true,
                        str: String.fromCharCode(map)
                    };
                }
            }.bind(this));
            // creates string combination pressed by the user
            Object.keys(this._searchShortcuts).forEach(function (key) {
                if (this._searchShortcuts[key].isActive) {
                    mapStr += '-' + this._searchShortcuts[key].str;
                }
            }.bind(this));
            // removes the first dash
            mapStr = mapStr.substring(1);

            // checks match between user combination and shortcuts registered in the shortcuts.js,
            // if a match is found broadcast a message
            for (var shortcut in this._shortcuts) {
                combo = this._shortcuts[shortcut].combo;
                isSameCombo = utility.findKeysShortcuts(mapStr, combo, '-');
                canExecuteCombo = this._validate.call(this, combo);
                if (isSameCombo && canExecuteCombo.isValid) {
                    if (canExecuteCombo.canPreventDefault) {
                        event.preventDefault();
                    }
                    this._comboHold = shortcut;
                    var comboData = {
                        shortcut: this._comboHold,
                        combination: mapStr
                    };
                    topic.publish('keyboardShortcuts:combo', lang.clone(comboData));
                    break;
                }
            }
        },
        _detectUserInput: function () {
            // summary:
            //      Detects when a User presses a key.
            on(document, 'keydown', function (event) {
                this._comboHold = null;
                this._map[event.which] = true;
                this._getCombo(event);
            }.bind(this));
            on(document, 'keyup', function (event) {
                // summary:
                //      Detects when a User releases a key.
                this._comboHold = null;
                delete this._map[event.which];
            }.bind(this));
        }
    };
    return function _getSingleton() {
        // summary:
        //      Gets a single instance, this module is a singleton.
        return (_instance = (_instance || new _KeyboardShortcuts()));
    };
});
