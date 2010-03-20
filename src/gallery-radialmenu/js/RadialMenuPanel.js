/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The RadialMenuPanel classes manages the panels for use with radio menu.
 * @class RadialMenuPanel
 */
YUI().add('gallery-radial-menu-panel', function(Y) {
	// constants
var	Lang = Y.Lang,

	_bind = function(fn, context) {
		return Y.bind(fn, context);
	},

	_detach = function(ctx, evt) {
		var o = ctx[evt];

		if (o) {
			o.detach();
			ctx[evt] = null;
		}
	},

    /**
     * The RadialMenuPanel constructor.
     * @method RadialMenuPanel
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	RadialMenuPanel = function(conf) {
		RadialMenuPanel.superclass.constructor.apply(this, arguments);
	};

	RadialMenuPanel.NAME = "radialMenuPanel";

	RadialMenuPanel.ATTRS = {

		/**
		 * @attribute centerpt
		 * @type Array
		 * @default null
		 * @description The center point for panel.
		 */
		centerpt: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute content
		 * @type String
		 * @default ''
		 * @description The panel HTML content.
		 */
		content: {
			value: '',
			validator: Lang.isString
		},

		/**
		 * @attribute hoverClass
		 * @type String
		 * @default ''
		 * @description The hover class.
		 */
		hoverClass: {
			value: 'yui-radialmenupanel-hover',
			validator: Lang.isString
		},

		/**
		 * @attribute index
		 * @type Number
		 * @default 0
		 * @description The panel radial position.
		 */
		index: {
			value: 0,
			validator: Lang.isNumber
		},

		/**
		 * @attribute radialpt
		 * @type Array
		 * @default null
		 * @description The radial point for panel.
		 */
		radialpt: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute styles
		 * @type Object
		 * @default null
		 * @description The style overrides for this panel.
		 */
		styles: {
			value: null,
			validator: Lang.isObject
		},

		/**
		 * @attribute tagName
		 * @type String
		 * @default "div"
		 * @description The tag to use for panels.
		 */
		tagName: {
			value: 'div',
			validator: Lang.isString
		}
	};


	Y.extend(RadialMenuPanel, Y.Overlay, {
		_mouseEnterHandler: null,
		_mouseLeaveHandler: null,

		/**
		 * Handles the mouse enter event, adding the hover class.
		 * @method _handleMouseEnter
		 * @protected
		 */
		_handleMouseEnter: function() {
			this.get('boundingBox').addClass(this.get('hoverClass'));
		},

		/**
		 * Handles the mouse leave event, removing the hover class.
		 * @method _handleMouseLeave
		 * @protected
		 */
		_handleMouseLeave: function() {
			this.get('boundingBox').removeClass(this.get('hoverClass'));
		},

		/**
		 * @see Y.Widget.bindUI
		 */
		bindUI: function() {
			var _this = this,
				node = _this.get('boundingBox');

			_this._mouseEnterHandler = node.on('mouseenter', _bind(_this._handleMouseEnter, _this));
			_this._mouseLeaveHandler = node.on('mouseleave', _bind(_this._handleMouseLeave, _this));
		},

		/**
		 * @see Y.Base.destructor
		 */
		destructor: function() {
			var _this = this,
				node = _this.get('boundingBox')._node;

			_this.hide();
			RadialMenuPanel.superclass.destructor.apply(_this, arguments);
			if (node.parentNode) {node.parentNode.removeChild(node);}
		},

		/**
		 * @see Y.Widget.hide
		 */
		hide: function() {
			_detach(this, '_mouseEnterHandler');
			_detach(this, '_mouseLeaveHandler');
			RadialMenuPanel.superclass.hide.apply(this, arguments);
		},

		/**
		 * @see Y.Base.initializer
		 */
		initializer: function(config) {
			RadialMenuPanel.superclass.initializer.apply(this, arguments);
		},

		/**
		 * @see Y.Widget.renderUI
		 */
		renderUI: function() {
			this.hide();
		},

		/**
		 * @see Y.Widget.show
		 */
		show: function() {
			this.bindUI();
			RadialMenuPanel.superclass.show.apply(this, arguments);
		},

		/**
		 * @see Y.Widget.syncUI
		 */
		syncUI: function() {
			var content = this.get('content');

			if (content) {
				this.get('contentBox').set('innerHTML', content);
			}
		}
	});

Y.RadialMenuPanel = RadialMenuPanel;
}, '1.1.00', {requires: ['overlay', 'event-mouseenter']});