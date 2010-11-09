YUI.add('gallery-html5-forms', function(Y) {

	/*
	 * todo: need to support various additional input types by default -mes
	 */

	// for debugging purposes
	if (Y.JSON) {
		Y.log("Y.Modernizr.input attribute support=" + Y.JSON.stringify(Y.Modernizr.input));
		Y.log("Y.Modernizr.input type support=" + Y.JSON.stringify(Y.Modernizr.inputtypes));
	}

	function _blur_or_keydown(elNode, fnCallback) {
		var timeoutId;

		elNode.on('blur', function() {
			clearTimeout(timeoutId);
			fnCallback.apply(elNode, arguments);
		});

		elNode.on('keydown', function() {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(function() {
				fnCallback.apply(elNode, arguments);
			}, 1000);
		});
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
		elNode[bool ? ADDCLASS : REMOVECLASS](HTML5_form_support.CLS_PLACEHOLDER);
	}

	/**
	 * Validates the value of the node.
	 * @method _validate
	 * @param  elNode {Node} Required. The node instance.
	 * @param  bHasValidation {Boolean} Required. Indicates that validation logic should occur.
	 * @private
	 */
	function _validate(elNode, bHasValidation) {
		var value = Lang.trim(elNode.get('value')),
			max = elNode.get(MAX),
			min = elNode.get(MIN),
			placeholderText = elNode.get(PLACEHOLDER),
			intvalue, isvalid, rx;

		if (placeholderText) {
			if (value && value != placeholderText) {
				_update_placeholder_class(elNode, false);
			}
			else {
				elNode.set('value', placeholderText);
				_update_placeholder_class(elNode, true);
			}
		}

		if (bHasValidation) {
			if (elNode.get(REQUIRED)) {
				isvalid = value && value != placeholderText;
			}

			if (isvalid && elNode.get(PATTERN)) {
				rx = RegExp(elNode.get(PATTERN));
				isvalid = value.match(rx);
			}

			if (isvalid && max || min) {
				intvalue = _intvalue(value);
				isvalid = (max && max >= intvalue) && (min && min <= intvalue);
			}

			elNode[isvalid ? ADDCLASS : REMOVECLASS](HTML5_form_support.CLS_VALID);
			elNode[! isvalid ? ADDCLASS : REMOVECLASS](HTML5_form_support.CLS_INVALID);
			return isvalid;
		}

		return true;
	}

	var ADDCLASS = 'addClass',
	AUTOFOCUS = 'autofocus',
	BOUNDING_BOX = 'boundingBox',
	MAX = 'max',
	MIN = 'min',
	PATTERN = 'pattern',
	PLACEHOLDER = 'placeholder',
	REMOVECLASS = 'removeClass',
	REQUIRED = 'required',
	STEP = 'step',
	SUPPORTED = 'supported',

	RX = {
		email: /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
		url: /((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+[\w\d:#@%/;$()~_?\+-=\\\.&]*)/
	},

	Lang = Y.Lang,

	HTML5_form_support = Y.Base.create('html5_input_attrs', Y.Widget, [], {

		bindUI: function() {
			var that = this,
				aInputs = that._inputs,
				hasAutofocusAlready = false,
				elBb = that.get(BOUNDING_BOX),
				bAttachForm = false;

			if (aInputs) {
				aInputs.each(function(elNode) {
					var sPattern = elNode.get(PATTERN),
						bHasValidation =
						elNode.get(MAX) ||
						elNode.get(MIN) ||
						elNode.get(PATTERN) ||
						elNode.get(REQUIRED),
						sPlaceholderText = elNode.get(PLACEHOLDER),
						sType = elNode.get('type');

					if (! that.get(SUPPORTED)) {
						if (sType && RX[sType] && ! sPattern) {
							elNode.set(PATTERN, RX[sType]);
						}

						// handle autofocus
						if (elNode.get(AUTOFOCUS) && ! hasAutofocusAlready) {
							elNode.focus();
							hasAutofocusAlready = true;
						}

						// setup placeholder
						if (sPlaceholderText) {
							elNode.on('focus', function() {
								var value = Lang.trim(elNode.get('value'));
								if (value == sPlaceholderText) {
									elNode.set('value', '');
									_update_placeholder_class(elNode, false);
								}
							});
						}

						_validate(elNode, bHasValidation);
					}

					if (bHasValidation || sPlaceholderText) {
						bAttachForm = true;
						_blur_or_keydown(elNode, function() {
							var isValid = that.get(SUPPORTED) ? elNode.test('input:valid') : _validate(this,bHasValidation);
							that.disableSubmitButton(isValid && that.isFormValid());
							that.get('aftervalidationfx')(isValid, this, that);
						});
					}
				});

				if (bAttachForm && 'FORM' == elBb.get('tagName').toUpperCase()) {
					elBb.on('submit', function(e) {
						var bValid = true;

						aInputs.each(function(node) {
							bValid = bValid && _validate(node, true);
						});

						if (! bValid) {
							e.halt();
						}
					});
				}
			}
		},

		/**
		 * Change the disabled attribute of the submit button.
		 * @method disableSubmitButton
		 * @param  isValid {Boolean} The form is valid.
		 * @public
		 */
		disableSubmitButton: function(isValid) {
			if (this.btnsubmit) {
				this.btnsubmit[isValid ? 'removeAttribute' : 'set']('disabled', 'disabled');
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
			that.btnsubmit = elBb.one(that.get('submitbtn'));

			// don't do anything if HTML 5 enabled
			if (supported) {
				Y.log('Browser completely supports HTML 5 forms; NOT using HTML5_form_support.');

				if (aftervalidationfx && 'FORM' == elBb.get('tagName').toUpperCase()) {
					that.populateInputs();
				}
			}
			else {
				Y.log('Browser does not support all HTML 5 forms; using HTML5_form_support.');
				that.populateInputs();
			}
		},

		/**
		 * Checks if the current browser supports the specified attribute.
		 * @method isAttributeSupported
		 * @param  sAttr {String} Required. The attribute name.
		 * @return {Mixed} Modernizr value for input attribute.
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
		isFormValid: function(fnCallback) {
			var that = this,
				isValid = true;

			// ensure inputs are populated first
			if (! that._inputs) {
				that.populateInputs();
			}

			that._inputs.each(function(el) {
				isValid = isValid && (el.hasClass(HTML5_form_support.CLS_VALID) || el.test('input:valid'));
			});

			return isValid;
		},

		/**
		 * Finds the usable inputs in the form and sets to a variable; call to repopulate if form changes.
		 * @method populateInputs
		 * @public
		 */
		populateInputs: function() {
			this._inputs = this.get(BOUNDING_BOX).all('input:not([type=hidden])');
		},

		renderUI: function() {
		}
	},
	{
		// emulates pseudo classes ':valid' and ':invalid'
		CLS_PLACEHOLDER: PLACEHOLDER,
		CLS_VALID: 'valid',
		CLS_INVALID: 'invalid',

		ATTRS: {
			aftervalidationfx: {
				validator: Lang.isFunction,
				value: function() {}
			},
			submitbtn: {
				value: 'button[type=submit]',
				validator: Lang.isString
			},
			supported: {
				validator: Lang.isBoolean,
				writeOnce: true
			}
		}
	});

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

	Y.HTML5_form_support = HTML5_form_support;

}, '@VERSION@', {requires: ['base', 'widget', 'node', 'gallery-modernizr'], optional: ['json']});