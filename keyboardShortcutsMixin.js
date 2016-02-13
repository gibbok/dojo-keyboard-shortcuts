define([
    'dojo/topic'
], function (
    topic
    ) {
    'use strict';
    // module:
    //		keyboardShortcutsMixin
    // summary:
    //      Mixin of rules for keyboardShortcuts.
    return {
        _rulesLogic: {
            // rules: Object
            //      Logic rules. You can add more rules here as new properties/functions.
            isFocusOnInput: function () {
                // summary:
                //      Checks if focus is on an input or textarea tags.
                var result = false,
                    canPreventDefault = true,
                    activeElement = document.activeElement;
                if (activeElement.nodeName === 'INPUT' ||
                    activeElement.nodeName === 'TEXTAREA') {
                    result = true;
                    canPreventDefault = false;
                } else {
                    result = false;
                }
                return {
                    doesApply: result,
                    canPreventDefault: canPreventDefault
                };
            }
        },
        _validate: function (combo) {
            // summary:
            //      Starts logic rules validation.
            var result = true,
                doesRuleApply = false,
                rule;
            /*jshint forin: false */
            for (var ruleName in this._rulesLogic) {
                rule = this._rulesLogic[ruleName].call(this, combo);
                doesRuleApply = rule.doesApply;
                if (doesRuleApply) {
                    result = false;
                    break;
                }
            }
            /*jshint forin: true */
            return {
                isValid: result,
                canPreventDefault: rule.canPreventDefault
            };
        }
    };
});
