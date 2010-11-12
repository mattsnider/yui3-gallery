YUI.add('gallery-html5-forms', function(Y) {

/*
 * todo: need to support various additional input types by default -mes
 */

// todo: select should support autofocus & required

// for debugging purposes
if (Y.JSON) {
}

/**
 * Attaches the `blur` callback function to the element; also considers a `keydown` with a 1 second timeout a `blur`.
 * @method _getter
 * @param  elNode {Node} Required. The node instance.
 * @param  fnCallback {String} Required. The blur callback function
 * @private
 */
function _blur_or_keydown(elNode, fnCallback) {
	var timeoutId;

	elNode.on('blur', function() {
		clearTimeout(timeoutId);
		fnCallback.apply(elNode, arguments);
	});

	elNode.on('keydown', function() {
		var args = arguments;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
			fnCallback.apply(elNode, args);
		}, 1000);
	});
}

/**
 * Evaluates if the `max` attribute is greater than or equal to the value; returns true if attribute is not defined.
 * @method _evaluate_attr_max
 * @param  elNode {Node} Required. The node instance.
 * @return {Boolean} Valid?
 * @private
 */
function _evaluate_attr_max(elNode) {
	var max = elNode.get(MAX);
	return Lang.isValue(max) ? _intvalue(elNode.getValue()) <= max : true;
}

/**
 * Evaluates if the `min` attribute is less than or equal to the value; returns true if attribute is not defined.
 * @method _evaluate_attr_min
 * @param  elNode {Node} Required. The node instance.
 * @return {Boolean} Valid?
 * @private
 */
function _evaluate_attr_min(elNode) {
	var min = elNode.get(MIN);
	return Lang.isValue(min) ? _intvalue(elNode.getValue()) >= min : true;
}

/**
 * Evaluates if the value matches the regex in the `pattern` attribute; returns true if attribute is not defined.
 * @method _evaluate_attr_max
 * @param  elNode {Node} Required. The node instance.
 * @return {Boolean} Valid?
 * @private
 */
function _evaluate_attr_pattern(elNode) {
	var pattern = elNode.get(PATTERN),
		rx;

	if (pattern) {
		rx = RegExp(pattern);
		return elNode.getValue().match(rx);
	}

	return true;
}

/**
 * Handles the updating of the placeholder text for a node.
 * @method _evaluate_attr_placeholder
 * @param  elNode {Node} Required. The node instance.
 * @private
 */
function _evaluate_attr_placeholder(elNode) {
	var sPlaceholderText = elNode.get(PLACEHOLDER),
		sValue = elNode.getValue();

	if (sPlaceholderText) {
		if (sValue && sValue != sPlaceholderText) {
			_update_placeholder_class(elNode, false);
		}
		else {
			elNode.set('value', sPlaceholderText);
			_update_placeholder_class(elNode, true);
		}
	}
}

/**
 * Evaluates if there is a value and that it is not equal to the placeholder text; returns true if attribute is not defined.
 * @method _evaluate_attr_required
 * @param  elNode {Node} Required. The node instance.
 * @return {Boolean} Valid?
 * @private
 */
function _evaluate_attr_required(elNode) {
	var sPlaceholderText = elNode.get(PLACEHOLDER),
		sValue = elNode.getValue();

	return elNode.get(REQUIRED) ? sValue && sValue != sPlaceholderText : true;
}

/**
 * Finds the real `type`, since non-HTML5 browsers will return 'text' for all non-standard types.
 * @method _find_real_type
 * @param  elNode {Node} Required. The node instance.
 * @return {String} The actual `type` attribute value.
 * @private
 */
function _find_real_type(elNode) {
	var sId = elNode.get('id'),
		sResult = elNode.get('type'),
		sContent, rx1, rx2;

	if ('text' == sResult.toLowerCase()) {
		sContent = elNode.get('parentNode').get('innerHTML');
		rx1 = new RegExp('.*?id="' + sId + '"\\s+type="(\\w+)".*', 'i');
		rx2 = new RegExp('.*?type="(\\w+)"\\s+id="' + sId + '".*', 'i');
		sResult = rx1.exec(sContent);

		if (sResult) {
			return sResult[1];
		}
		else {
			sResult = rx2.exec(sContent);
		}
	}

	return sResult ? sResult[1] : 'text';
}

/**
 * Handles the fetching of an attribute's value from the DOM node.
 * @method _getter
 * @param  elNode {Node} Required. The node instance.
 * @param  sAttr {String} Required. The attribute name.
 * @return {String} The attribute value.
 * @private
 */
function _getter(elNode, sAttr) {
	return elNode[sAttr] || elNode.getAttribute(sAttr);
}

/**
 * Handles the fetching of an attribute's existence from the DOM node.
 * @method _has
 * @param  elNode {Node} Required. The node instance.
 * @param  sAttr {String} Required. The attribute name.
 * @return {Boolean} The attribute exists.
 * @private
 */
function _has(elNode, sAttr) {
	return elNode.hasAttribute(sAttr);
}

/**
 * Converts the value to a number; null indicates failure.
 * @method _intvalue
 * @param value {String} Required. The value to convert.
 * @return {Number} The value as a number.
 * @private
 */
function _intvalue(value) {
	try {
		return parseInt(value);
	}
	catch(e) {
		return null;
	}
}

/**
 * Handles the setting of an attribute's value for a DOM node.
 * @method _setter
 * @param  elNode {Node} Required. The node instance.
 * @param  sAttr {String} Required. The attribute name.
 * @param  val {String} Required. The new attribute value.
 * @private
 */
function _setter(elNode, sAttr, val) {
	elNode[sAttr] = val;
	elNode.setAttribute(sAttr, val);
}

/**
 * Updates the placeholder class for the input.
 * @method _update_placeholder_class
 * @param  elNode {Node} Required. The node instance.
 * @param  bool {Boolean} Required. Indicates if placeholder class should be applied or removed.
 * @private
 */
function _update_placeholder_class(elNode, bool) {
	elNode.toggleClass(HTML5_form_support.CLS_PLACEHOLDER, bool);
}

/**
 * Validates the value of the node.
 * @method _validate
 * @param  elNode {Node} Required. The node instance.
 * @private
 */
function _validate(elNode) {
	var isValid = true,
		sTagName = elNode.get('tagName').toUpperCase();

	if ('SELECT' != sTagName) {
		_evaluate_attr_placeholder(elNode);
	}

	isValid = _evaluate_attr_required(elNode);

	if ('INPUT' == sTagName) {
		isValid = isValid && _evaluate_attr_pattern(elNode);
		isValid = isValid && _evaluate_attr_max(elNode);
		isValid = isValid && _evaluate_attr_min(elNode);
	}

	elNode.toggleClass(HTML5_form_support.CLS_VALID, isValid);
	elNode.toggleClass(HTML5_form_support.CLS_INVALID, ! isValid);
	return isValid;
}

// name shortcuts
var AUTOFOCUS = 'autofocus',
BOUNDING_BOX = 'boundingBox',
MAX = 'max',
MIN = 'min',
PATTERN = 'pattern',
PLACEHOLDER = 'placeholder',
REQUIRED = 'required',
STEP = 'step',
SUPPORTED = 'html5supported',

// regular expressions to support new HTML 5 input types
RX = {
	email: /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
	url: /((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+[\w\d:#@%/;$()~_?\+-=\\\.&]*)/i
},

// framework shortcuts
Lang = Y.Lang,

HTML5_form_support = Y.Base.create('html5_input_attrs', Y.Widget, [], {

	/**
	 * Callback function for managing blurring of input elements.
	 * @method _handleBlur
	 * @param e {Event} Required. The javascript `blur` or `keydown` event.
	 * @protected
	 */
	_handleBlur: function(e) {
		var that = this,
			elNode = e.target,
			isValid = that.get(SUPPORTED) ? e.target.test('input:valid') : _validate(elNode);
		
		that.disableForm(isValid && that.isFormValid());
		that.get('aftervalidationfx')(isValid, elNode, that);
	},

	/**
	 * Callback function for managing the form submission; only allows submit events when form is valid.
	 * @method _handleFocus
	 * @param e {Event} Required. The javascript `blur` or `keydown` event.
	 * @protected
	 */
	_handleFocus: function(e) {
		var elNode = e.target,
			sPlaceholderText = elNode.get(PLACEHOLDER),
			value = elNode.getValue();
		
		if (value == sPlaceholderText) {
			elNode.set('value', '');
			_update_placeholder_class(elNode, false);
		}
	},

	/**
	 * Callback function for managing the form submission; only allows submit events when form is valid.
	 * @method _handleSubmit
	 * @param e {Event} Required. The javascript `submit` event.
	 * @protected
	 */
	_handleSubmit: function(e) {
		var bValid = true,
			submitfx = this.get('submitfx');

		this._fields.each(function(node) {
			bValid = bValid && _validate(node);
		});

		if (submitfx || ! bValid) {
			e.halt();

			if (submitfx) {
				submitfx.call(e.target, e, this);
			}
		}
	},

	bindUI: function() {
		var that = this,
			hasAutofocusAlready = false,
			elBb = that.get(BOUNDING_BOX),
			bAttachForm = false,
			bIsSupported = that.get(SUPPORTED);

		if (! bIsSupported) {
			// todo: can we use the capture phase to delegate events instead?
			that._fields.each(function(elNode) {
				var sPattern = elNode.get(PATTERN),
					bHasValidation =
					elNode.get(MAX) ||
					elNode.get(MIN) ||
					elNode.get(PATTERN) ||
					elNode.get(REQUIRED),
					sPlaceholderText = elNode.get(PLACEHOLDER),
					sType = _find_real_type(elNode);

				// special rx to handle validation of new HTML 5 types
				if (sType && RX[sType] && ! sPattern) {
					elNode.set(PATTERN, RX[sType]);
					bHasValidation = true;
				}

				// handle autofocus; only autofocuses on the first element
				if (elNode.get(AUTOFOCUS) && ! hasAutofocusAlready) {
					elNode.focus();
					hasAutofocusAlready = true;
				}

				// setup placeholder
				if (sPlaceholderText) {
					elNode.on('focus', Y.bind(that._handleFocus, that));
				}

				_validate(elNode);

				if (bHasValidation || sPlaceholderText) {
					bAttachForm = true; // optimization: don't attach submit handler, if no HTML5 attributes
					_blur_or_keydown(elNode, Y.bind(that._handleBlur, that));
				}
			});
		}

		if ((bAttachForm || that.get('submitfx')) && that._form) {
			elBb.on('submit', Y.bind(that._handleSubmit, that));
		}
	},

	/**
	 * Change the disabled attribute of the submit button and form.
	 * @method disableForm
	 * @param  isValid {Boolean} The form is valid.
	 * @public
	 */
	disableForm: function(isValid) {
		if (this._form) {
			this._form[isValid ? 'removeAttribute' : 'set']('disabled', 'disabled');
		}
		
		if (this._btnsubmit) {
			this._btnsubmit[isValid ? 'removeAttribute' : 'set']('disabled', 'disabled');
		}
	},

	initializer: function() {
		var that = this,
			supported =
			Y.Modernizr.input.autofocus &&
			Y.Modernizr.input.max &&
			Y.Modernizr.input.min &&
			Y.Modernizr.input.pattern &&
			Y.Modernizr.input.placeholder &&
			Y.Modernizr.input.required &&
			Y.Modernizr.input.step,
			aftervalidationfx = this.get('aftervalidationfx'),
			elBb = that.get(BOUNDING_BOX);

		that.set(SUPPORTED, supported);
		that._btnsubmit = elBb.one(that.get('submitbtn'));
		that._form = 'FORM' == elBb.get('tagName').toUpperCase() ? elBb : null;
		that._fields = new Y.NodeList([]);

		// don't do anything if HTML 5 enabled
		if (supported) {

			if (aftervalidationfx && that._form) {
				that.populateInputs();
			}
		}
		else {
			that.populateInputs();
		}
	},

	/**
	 * Checks if the current browser supports the specified attribute.
	 * @method isAttributeSupported
	 * @param  sAttr {String} Required. The attribute name.
	 * @return {String} Modernizr value for input attribute.
	 * @public
	 */
	isAttributeSupported: function(sAttr) {
		return Y.Modernizr.input[sAttr];
	},

	/**
	 * Check if inputs are in a known good state.
	 * @method isFormValid
	 * @return {boolean} Indicates valid form.
	 * @public
	 */
	isFormValid: function() {
		var that = this,
			isValid = true;

		that._fields.some(function(el) {
			isValid = isValid && (el.hasClass(HTML5_form_support.CLS_VALID) || el.test('input:valid'));
			return ! isValid;
		});

		return isValid;
	},

	/**
	 * Finds the usable inputs in the form and sets to a variable; call to repopulate if form changes.
	 * @method populateInputs
	 * @public
	 */
	populateInputs: function() {
		var that = this,
			elBb = that.get(BOUNDING_BOX);

		that._fields = elBb.all('input:not([type=hidden]):not([type=submit]):not([type=button])');
		that._fields._nodes = that._fields._nodes.concat(elBb.all('textarea')._nodes);
//		that._fields._nodes = that._fields._nodes.concat(elBb.all('select')._nodes);
	},

	renderUI: function() {
	}
},
{
	// class applied to the emulate browser placeholder styles
	CLS_PLACEHOLDER: PLACEHOLDER,
	
	// emulates pseudo classes ':valid' and ':invalid'
	CLS_VALID: 'valid',
	CLS_INVALID: 'invalid',

	ATTRS: {

		/**
		 * A callback function to execute after field evaluation.
		 * @property aftervalidationfx
		 * @type Function
		 */
		aftervalidationfx: {
			validator: Lang.isFunction,
			value: function() {}
		},

		/**
		 * A read only variable for determining if the current browser supports HTML 5.
		 * @property html5supported
		 * @readonly
		 */
		html5supported: {
			validator: Lang.isBoolean,
			writeOnce: true
		},

		/**
		 * The CSS rule to find the submit button for your form. When defined, will automatically disable the button.
		 * @property submitbtn
		 * @type String
		 */
		submitbtn: {
			value: 'button[type=submit]',
			validator: Lang.isString
		},

		/**
		 * A callback function to execute in place of normal form submission; passed the event and a reference to `this`; execution context is the form.
		 * @property submitfx
		 * @type Function
		 */
		submitfx: {
			validator: Lang.isFunction,
			value: null
		}
	}
});

// augumenting Y.Node with two useful functions
Y.Node.prototype.getValue = function() {
	return Lang.trim(this.get('value'));
};

Y.Node.prototype.toggleClass = function(className, bool) {
	this[bool ? 'addClass' : 'removeClass'](className);
};

// augment Y.Node with HTML 5 attributes
Y.mix(Y.Node.ATTRS, {
	autofocus: {
		getter: function() {
			return _has(this._node,AUTOFOCUS);
		},
		setter: function(val) {
			return _setter(this._node,AUTOFOCUS,val);
		},
		validator: Lang.isBoolean
	},
	max: {
		getter: function() {
			return _getter(this._node,MAX);
		},
		setter: function(val) {
			return _setter(this._node,MAX,val);
		},
		validator: Lang.isNumber
	},
	min: {
		getter: function() {
			return _getter(this._node,MIN);
		},
		setter: function(val) {
			return _setter(this._node,MIN,val);
		},
		validator: Lang.isNumber
	},
	pattern: {
		getter: function() {
			return _getter(this._node,PATTERN);
		},
		setter: function(val) {
			return _setter(this._node,PATTERN,val);
		},
		validator: Lang.isString
	},
	placeholder: {
		getter: function() {
			return _getter(this._node,PLACEHOLDER);
		},
		setter: function(val) {
			return _setter(this._node,PLACEHOLDER,val);
		},
		validator: Lang.isString
	},
	required: {
		getter: function() {
			return _has(this._node,REQUIRED);
		},
		setter: function(val) {
			return _setter(this._node,REQUIRED,val);
		},
		validator: Lang.isBoolean
	},
	step: {
		// todo: what do I want to do with step??? -mes
		getter: function() {
			return _getter(this._node,STEP);
		},
		setter: function(val) {
			return _setter(this._node,STEP,val);
		},
		validator: Lang.isNumber
	}
});

Y.HTML5FormSupport = HTML5_form_support;


}, '@VERSION@' ,{optional:['json'], requires:['base','widget','node','gallery-modernizr']});
