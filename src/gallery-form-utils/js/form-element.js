/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array crap. Use these functions to work with forms fields.
 *
 * @class FormUtilsField
 */
var FormField = {

	/**
	 * An array of strings, which are field names that should never be serialized. For example, validator is defined by default,
	 * 	as this is usually a meta field that is used to validate a form.
	 * @property DO_NOT_SERIALIZE_FIELD_NAMES
	 * @type Array
	 */
	DO_NOT_SERIALIZE_FIELD_NAMES: ['validator'],

	/**
	 * Updates the onblur and onclick events of the element to show default text.
	 * @method onFocusAndBlur
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to attach events to.
	 * @param  sCopy {String} Required. The default text.
	 * @param  sOverrideColor {String} Optional. The disabled class.
	 * @static
	 */
	attachFocusAndBlur: function(elFld, sCopy, sOverrideColor) {
		var elForm = elFld.ancestor('form'),
			sValue;

		sCopy = Lang.trim(sCopy);

		// function that resets to the default
		function fnUpdate(sCopy, sColor) {
			elFld.set('value', sCopy);
			elFld[sColor ? 'addClass' : 'removeClass'](sColor);
		}

		function fnHandlefocus() {
			if (sCopy == Lang.trim(elFld.get('value'))) {
				fnUpdate('', '');
			}
		}

		// on focus clear value if equal to default
		elFld.on('focus', fnHandlefocus);

		// onblur reset default if no value entered
		elFld.on('blur', function() {
			if (! Lang.trim(elFld.get('value'))) {fnUpdate(sCopy, sOverrideColor);}
		});

		// input is inside a form, don't submit default values
		if (elForm) {
			elForm.on('submit', Y.bind(fnHandlefocus, elFld));
		}

		// update the initial state if needed
		sValue = Lang.trim(elFld.get('value'));
		if (sCopy == sValue || '' === sValue) {fnUpdate(sCopy, sOverrideColor);}
	},

	attachSubmitValidator: function(elFld, rx, success) {
		var elForm = elFld.ancestor('form'),
			timeoutId;

		function handleBlur() {
			clearTimeout(timeoutId);
			elForm[rx.exec(Lang.trim(elFld.get('value'))) ? 'addClass' : 'removeClass']('valid');
		}

		elFld.on('focus', handleBlur);
		elFld.on('blur', handleBlur);
		elFld.on('keydown', function() {
			timeoutId = setTimeout(handleBlur, 2000);
		});
		elForm.on('submit', function(e) {
			handleBlur();

			if (elForm.hasClass('valid')) {
				success(e);
			}
			else {
				e.halt();
			}
		});
	},

	/**
	 * Short-cut method to do a browser safe check on any HTMLInputElement of type checkbox (possibly radio too).
	 * @method check
	 * @param  elFld {Node} Required. Pointer or string reference to checkable DOM element.
	 * @param  fl {Boolean} True when checkbox should be checked.
	 * @static
	 */
	check: function(elFld, fl) {
		// if this check isn't in place Safari & Opera will check false
		if (elFld.get('checked') !== fl) {
			elFld.set('checked', fl);
		}
	},

	/**
	 * Resets the value of the field.
	 * @method clear
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to clear.
	 * @static
	 */
	clear: function(elFld) {
		if ('select' == elFld.get('tagName')) {
			elFld.set('selectedIndex', 0);
		} else if ('checkbox' == elFld.get('type')) {
			elFld.set('checked', false);
		} else {
			elFld.set('value', '');
		}
	},

	/**
	 * Disables the value of the field.
	 * @method disable
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to disable.
	 * @static
	 */
	disable: function(elFld) {
		elFld.addClass(CLS_DISABLED);
		elFld.set(CLS_DISABLED, true);
	},

	/**
	 * Enables the value of the field.
	 * @method enable
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to enable.
	 * @static
	 */
	enable: function(elFld) {
		elFld.removeClass(CLS_DISABLED);
		elFld.set(CLS_DISABLED, false);
	},

	/**
	 * Focuses on the elements or tries to select it, if function is supported.
	 * @method focus
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to activate.
	 * @param  bNoSelect {Boolean} Optional. When true, input text is not selected; default is falsy.
	 * @static
	 */
	focus: function(elFld, bNoSelect) {
		var oReg = elFld.get('region');

		// element only has dimensions when it is visible
		if (oReg.left || oReg.top || oReg.width || oReg.height) {
			setTimeout(function() {
				elFld.focus();
				if (! bNoSelect) {elFld.select();}
			}, 1);
		}
	},

	/**
	 * Attempt to find the value of field.
	 * @method getValue
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {String} The field value or empty string.
	 * @static
	 */
	getValue: function(elFld) {
		var sMethod = elFld.getTagName(),
			aParameter = FormFieldSerializers[sMethod](elFld);

		return aParameter ? aParameter[1] : '';
	},

	/**
	 * Tests if the field has a value.
	 * @method hasValue
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Boolean} True, when field is empty or non-existing.
	 * @static
	 */
	hasValue: function(elFld) {
		return '' !== FormField.getValue(elFld);
	},

	/**
	 * Tests if the field is of one of the provided types.
	 * @method isType
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to evaluate.
	 * @param  arg1 {String} Required. An input type to test.
	 * @param  argX {String} Optional. Any number of additional input types to test.
	 * @return {Boolean} True, when input matches provided type.
	 * @static
	 */
	isType: function(elFld/*, arg1, arg2, ...*/) {
		var sType = elFld.getType('type');
		if (! sType) {return false;}

		for (var nIndex = 1; nIndex < arguments.length; nIndex += 1) {
			if (sType == arguments[nIndex]) {return true;}
		}

		return false;
	},

	/**
	 * Serializes the form into a key value pair query string.
	 * @method serialize
	 * @param  elFld {Node} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {String} the key/value pairs as a query string.
	 * @static
	 */
	serialize: function(elFld) {

		var sMethod = elFld.getTagName(),
			aParameter, sKey;

		// ensure the field is not one of the names that we don't want to serialize
		if (-1 === Y.Array.indexOf(FormField.DO_NOT_SERIALIZE_FIELD_NAMES, sMethod)) {
			aParameter = FormFieldSerializers[sMethod](elFld);

			if (aParameter) {
				sKey = encodeURIComponent(Lang.trim(aParameter[0]));

				// key not parsed, field does not have a name, return empty string
				if (0 === sKey.length) {
					return '';
				}

				// some serializers return an array of values, rest of function expects all values to be arrays, so convert any non-arrays
				if (! Lang.isArray(aParameter[1])) {
					aParameter[1] = [Lang.trim(aParameter[1])];
				}

				Y.Array.each(aParameter[1], function(value, i) {
					aParameter[1][i] = sKey + '=' + encodeURIComponent(value);
				});

				return aParameter[1].join('&');
			}
		}

		return '';
	}
};

Y.FormUtilsField = FormField;