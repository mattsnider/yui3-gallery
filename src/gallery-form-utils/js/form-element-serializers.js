/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array crap.
 *
 * @class FormUtilsFieldSerializers
 */
FormFieldSerializers = {
	input: function(elFld) {
		switch (elFld.get('type')) {
			case 'checkbox':
			case 'radio':
				return FormFieldSerializers.inputSelector(elFld);
			default:
				return FormFieldSerializers.textarea(elFld);
		}
	},

	inputSelector: function(elFld) {
		if (elFld.get('checked')) {
			return FormFieldSerializers.textarea(elFld);
		}
	},

	textarea: function(elFld) {
		return [elFld.get('name'), elFld.get('value')];
	},

	select: function(elFld) {
		return FormFieldSerializers['select-one' == elFld.get('type') ? 'selectOne' : 'selectMany'](elFld);
	},

	selectOne: function(elFld) {
		var sValue = '',
			nIndex = elFld.get('selectedIndex'),
			oOption;

		if (0 <= nIndex) {
			oOption = elFld.get('options').item(nIndex);
			sValue = oOption.get('value') || oOption.get('text');
		}

		return [elFld.get('name'), sValue];
	},

	selectMany: function(elFld) {
		var sValue = [],
			nIndex = 0,
			oOption;

		for (; nIndex < elFld.length; nIndex += 1) {
			oOption = elFld.get('options').item(nIndex);

			if (oOption.get('selected')) {
				sValue.push(Lang.trim(oOption.get('value') || oOption.get('text')));
			}
		}

		return [elFld.get('name'), sValue];
	}
};

Y.FormUtilsFieldSerializers = FormFieldSerializers;