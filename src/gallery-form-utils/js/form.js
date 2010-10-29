// constants
var CLS_DISABLED = 'disabled',

// shortcuts
Lang = Y.Lang,

/**
 *  The Form Object provides APIs for searching and serializing forms.
 *  @class FormUtil
 */
Form = {

	DEFAULT_ELEMENTS: ['input', 'select', 'textarea'],

	/**
	 * Retrieves the first non-hidden element of the form.
	 * @method findFirstElement
	 * @param  elForm {Node} Required. A YUI 3 Node instance to search.
	 * @param  aIgnoreTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
	 * @return {Node} The first field not of the ignored types or NULL.
	 * @static
	 */
	findFirstElement: function(elForm, aIgnoreTypes) {
		return Form.getElements(elForm, aIgnoreTypes || ['hidden'], true);
	},

	/**
	 * Retrieves the first non-hidden element of the form and focuses on it.
	 * @method focusFirstElement
	 * @param  elForm {Node} Required. A YUI 3 Node instance to search.
	 * @param  aIgnoreTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
	 * @static
	 */
	focusFirstElement: function(elForm, aIgnoreTypes) {
		Form.Element.focus(Form.findFirstElement(elForm, aIgnoreTypes));
	},

	/**
	 * Retrieves all serializable elements of the form; sorts them in the order they appear in the DOM.
	 * @method focusFirstElement
	 * @param  elForm {Node} Required. A YUI 3 Node instance to search.
	 * @param  aIgnoreTypes {Array} Optional. List of element types to ignore; default is hidden.
	 * @param  bFirstOnly {Boolean} Optional. Find only the first node, then stop.
	 * @return {Array} A collection of Form fields.
	 * @static
	 */
	getElements: function(elForm, aIgnoreTypes, bFirstOnly) {
		var aResults = [],

			// should be redefined each time, because of closure on 'set'
			fnDomSearch = function(elNodes) {
				elNodes.find(function(elNode) {
					// only elements need to be iterated on
					if (document.ELEMENT_NODE === elNode.get('nodeType')) {
						// is the node one of hte default elements
						if (elNode.isTagName.apply(elNode, Form.DEFAULT_ELEMENTS)) {
							var sNodeType = elNode.get('type');

							if (! (aIgnoreTypes && Y.Array.find(aIgnoreTypes, function(sType) {
								return sType == sNodeType;
							}))) {
								aResults.push(elNode);
								if (bFirstOnly) {return true;}
							}
						} else if (elNode.hasChildNodes()) {
							fnDomSearch(elNode.get('childNodes'));
						}
					}
				});
			};

		fnDomSearch(elForm.get('childNodes'));

		return bFirstOnly ? aResults[0] : new Y.NodeList(aResults);
	},

	/**
	 * Retrieves all input elements of the form with typeName and/or name.
	 * @method getElementsByName
	 * @param  elForm {Node} Required. A YUI 3 Node instance to search.
	 * @param  sType {String} Optional. The type of input elements you want.
	 * @param  sName {String} Optional. The name of input elements you want.
	 * @static
	 */
	getInputs: function(elForm, sType, sName) {
		var sSelector = 'input';

		if (sType) {
			sSelector += '[type=' + sType + ']';
		}

		if (sName) {
			sSelector += '[name=' + sName + ']';
		}

		return elForm.all('input');
	},

	/**
	 * Serializes the form into a query string, collection &key=value pairs.
	 * @method serialize
	 * @param  elForm {Node} Required. A YUI 3 Node instance to search.
	 * @return {String} The serialized form.
	 * @static
	 */
	serialize: function(elForm) {
		var aQueryComponents = [];

		Form.getElements(elForm).each(function(elFld) {
			var sSerializedFld = FormField.serialize(elFld);
			if (sSerializedFld) {aQueryComponents.push(sSerializedFld);}
		});

		return aQueryComponents.join('&');
	}
};

Y.FormUtil = Form;