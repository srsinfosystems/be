/*!
* EmulateTab v0.2.8
* http://joelpurra.github.com/emulatetab
*
* Copyright Â© 2011, 2012, 2013, 2014, 2015 The Swedish Post and Telecom Authority (PTS)
* Developed by Joel Purra <http://joelpurra.com/>
* Released under the BSD-3-Clause license.
*
* A jQuery plugin to emulate tabbing between elements on a page.
*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function(document, $, namespace, pluginName) {
    "use strict";

    var eventNamespace = "." + pluginName,

        // TODO: get code for :focusable, :tabbable from jQuery UI?
        focusable = ":input, a[href]",

        // Keep a reference to the last focused element, use as a last resort.
        lastFocusedElement = null,

        // Private methods
        internal = {
            escapeSelectorName: function(str) {
                // Based on http://api.jquery.com/category/selectors/
                // Still untested
                return str.replace(/(!"#$%&'\(\)\*\+,\.\/:;<=>\?@\[\]^`\{\|\}~)/g, "\\\\$1");
            },

            findNextFocusable: function($from, offset) {
                var $focusable = $(focusable)
                    .not(":disabled")
                    .not(":hidden")
                    .not("a[href]:empty");

                if ($from[0].tagName === "INPUT" && $from[0].type === "radio" && $from[0].name !== "") {
                    var name = internal.escapeSelectorName($from[0].name);

                    $focusable = $focusable
                        .not("input[type=radio][name=" + name + "]")
                        .add($from);
                }

                var currentIndex = $focusable.index($from);

                var nextIndex = (currentIndex + offset) % $focusable.length;

                if (nextIndex <= -1) {
                    nextIndex = $focusable.length + nextIndex;
                }

                var $next = $focusable.eq(nextIndex);

                return $next;
            },

            focusInElement: function(event) {
                lastFocusedElement = event.target;
            },

            tryGetElementAsNonEmptyJQueryObject: function(selector) {
                try {
                    var $element = $(selector);

                    if ( !! $element && $element.size() !== 0) {
                        return $element;
                    }
                } catch (e) {
                    // Could not use element. Do nothing.
                }

                return null;
            },

            // Fix for EmulateTab Issue #2
            // https://github.com/joelpurra/emulatetab/issues/2
            // Combined function to get the focused element, trying as long as possible.
            // Extra work done trying to avoid problems with security features around
            // <input type="file" /> in Firefox (tested using 10.0.1).
            // http://stackoverflow.com/questions/9301310/focus-returns-no-element-for-input-type-file-in-firefox
            // Problem: http://jsfiddle.net/joelpurra/bzsv7/
            // Fixed:   http://jsfiddle.net/joelpurra/bzsv7/2/

            getFocusedElement: function() {
                // 1. Try the well-known, recommended method first.
                //
                // 2. Fall back to a fast method that might fail.
                // Known to fail for Firefox (tested using 10.0.1) with
                // Permission denied to access property "nodeType".
                //
                // 3. As a last resort, use the last known focused element.
                // Has not been tested enough to be sure it works as expected
                // in all browsers and scenarios.
                //
                // 4. Empty fallback
                var $focused = internal.tryGetElementAsNonEmptyJQueryObject(":focus") || internal.tryGetElementAsNonEmptyJQueryObject(document.activeElement) || internal.tryGetElementAsNonEmptyJQueryObject(lastFocusedElement) || $();

                return $focused;
            },

            emulateTabbing: function($from, offset) {
                var $next = internal.findNextFocusable($from, offset);

                $next.focus();
            },

            initializeAtLoad: function() {
                // Start listener that keep track of the last focused element.
                $(document)
                    .on("focusin" + eventNamespace, internal.focusInElement);
            }
        },

        plugin = {
            tab: function($from, offset) {
                // Tab from focused element with offset, .tab(-1)
                if ($.isNumeric($from)) {
                    offset = $from;
                    $from = undefined;
                }

                $from = $from || plugin.getFocused();

                offset = offset || +1;

                internal.emulateTabbing($from, offset);
            },

            forwardTab: function($from) {
                return plugin.tab($from, +1);
            },

            reverseTab: function($from) {
                return plugin.tab($from, -1);
            },

            getFocused: function() {
                return internal.getFocusedElement();
            }
        },

        installJQueryExtensions = function() {
            $.extend({
                emulateTab: function($from, offset) {
                    return plugin.tab($from, offset);
                }
            });

            $.fn.extend({
                emulateTab: function(offset) {
                    return plugin.tab(this, offset);
                }
            });
        },

        init = function() {
            namespace[pluginName] = plugin;

            installJQueryExtensions();

            // EmulateTab initializes listener(s) when jQuery is ready
            $(internal.initializeAtLoad);
        };

    init();
}(document, jQuery, JoelPurra, "EmulateTab"));
/*!
* @license PlusAsTab
* Copyright (c) 2011, 2012, 2013, 2014, 2015, 2016, 2017 The Swedish Post and Telecom Authority (PTS)
* Developed for PTS by Joel Purra <https://joelpurra.com/>
* Released under the BSD license.
*
* A jQuery plugin to use the numpad plus key as a tab key equivalent.
*/

/* global
jQuery,
*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function($, namespace)
{
    // Private functions
    function performEmulatedTabbing(isTab, isReverse, $target) {
        isTab = (isTab === true);
        isReverse = (isReverse === true);

        if (isTab
                && $target !== undefined
                && $target.length !== 0) {
            $target.emulateTab(isReverse ? -1 : +1);

            return true;
        }

        return false;
    }

    function isChosenTabkey(key) {
        if (key === options.key
                || ($.isArray(options.key)
                    && $.inArray(key, options.key) !== -1)) {
            return true;
        }

        return false;
    }

    function isEmulatedTabkey(event) {
            // Checked later for reverse tab
            //&& !event.shiftKey

        if (!event.altKey
                && !event.ctrlKey
                && !event.metaKey
                && isChosenTabkey(event.which)) {
            return true;
        }

        return false;
    }

    function checkEmulatedTabKeyDown(event) {
        if (!isEmulatedTabkey(event)) {
            return;
        }

        var $target = $(event.target),
            wasDone = null;

        if ($target.is(disablePlusAsTab)
                || $target.parents(disablePlusAsTab).length > 0
                || (!$target.is(enablePlusAsTab)
                    && $target.parents(enablePlusAsTab).length === 0)) {
            return;
        }

        wasDone = performEmulatedTabbing(true, event.shiftKey, $target);

        if (wasDone) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            return false;
        }

        return;
    }

    function initializeAtLoad() {
        $(document).on("keydown" + eventNamespace, checkEmulatedTabKeyDown);
    }

    namespace.PlusAsTab = {};

    var eventNamespace = ".PlusAsTab",

        // Keys from
        // https://api.jquery.com/event.which/
        // https://developer.mozilla.org/en/DOM/KeyboardEvent#Virtual_key_codes
        KEY_NUM_PLUS = 107,

        // Add options defaults here
        internalDefaults = {
            key: KEY_NUM_PLUS,
        },

        options = $.extend(true, {}, internalDefaults),

        enablePlusAsTab = ".plus-as-tab, [data-plus-as-tab=true]",
        disablePlusAsTab = ".disable-plus-as-tab, [data-plus-as-tab=false]";

    // Public functions
    namespace.PlusAsTab.setOptions = function(userOptions) {
            // Merge the options onto the current options (usually the default values)
        $.extend(true, options, userOptions);
    };

    namespace.PlusAsTab.plusAsTab = function($elements, enable) {
        enable = (enable === undefined ? true : enable === true);

        return $elements.each(function() {
            var $this = $(this);

            $this
                .not(disablePlusAsTab)
                .not(enablePlusAsTab)
                .attr("data-plus-as-tab", enable ? "true" : "false");
        });
    };

    $.fn.extend({
        plusAsTab: function(enable) {
            return namespace.PlusAsTab.plusAsTab(this, enable);
        },
    });

    // PlusAsTab initializes listeners when jQuery is ready
    $(initializeAtLoad);
}(jQuery, JoelPurra));
