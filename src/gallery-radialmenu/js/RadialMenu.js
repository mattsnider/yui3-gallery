/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * There are three major improvements I would like to make to this widget. The first is to leverage the existing overlay infrastructure
 * that is built into YUI3. This way we can leverage existing shimming and positioning architecture. The second is to animate the menu.
 * I believe the menu should rotate out from the center when opened and rotate in the center when closed. Lastly, the menu needs keyboard support.
 * Although the keyboard is not the same as a gaming controller, I believe the RadialMenu lends itself to keyboard interaction. 
 */

/**
 * The RadialMenu classes manages a the radio menu.
 * @class RadialMenu
 */
YUI().add('gallery-radial-menu', function(Y) {
	
	// constants
var	Lang = Y.Lang,
	CLS_PANEL = 'yui-' + Y.RadialMenuPanel.NAME.toLowerCase(),

	_bind = function(fn, context) {
		return Y.bind(fn, context);
	},

	_cancel = function(timer) {
		if (timer) {
			timer.cancel();
			timer = null;
		}
	},

	_detach = function(ctx, evt) {
		var o = ctx[evt];

		if (o) {
			o.detach();
			ctx[evt] = null;
		}
	},

	_getPanel = function(panels, node) {
		return Y.Array.find(panels, function(panel, i) {
			return panel.get('boundingBox').get('id') == node.get('id');
		});
	},

	_isBetween = function(i, lowerBounds, upperBounds) {
		return i > lowerBounds && i < upperBounds;
	},

    /**
     * The RadialMenu constructor.
     * @method RadialMenu
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	RadialMenu = function(conf) {
		RadialMenu.superclass.constructor.apply(this, arguments);
	};

	RadialMenu.ATTRS = {

		/**
		 * @attribute closeOnClick
		 * @type Boolean
		 * @default false
		 * @description Whether the menu should close on any click event or not.
		 */
		closeOnClick: {
			value: true
		},

		/**
		 * @attribute diameter
		 * @type Number
		 * @default 100
		 * @description The inner diameter of menu.
		 */
		diameter: {
			value: 100,
			validator: function(val) {
				return Lang.isNumber(val) && 100 < val;
			}
		},

		/**
		 * @attribute keyHoldTimeout
		 * @type Number
		 * @default 500
 		 * @description The timeout when holding down a key.
		 */
		keyHoldTimeout: {
			value: 500,
			validator: Lang.isNumber
		},

		/**
		 * @attribute panels
		 * @type Array
		 * @default []
		 * @description An array of RadialMenuPanels.
		 */
		panels: {
			value: [],
			validator: Lang.isArray
		},

		/**
		 * @attribute centerPoint
		 * @type Array
		 * @default null
		 * @description A position.
		 */
		centerPoint: {
			value: null,
			validator: Lang.isArray
		},

		/**
		 * @attribute useMask
		 * @type Boolean
		 * @default false
		 * @description When true, mask the viewport.
		 */
		useMask: {
			value: false,
			validator: Lang.isBoolean
		}
	};

	RadialMenu.NAME = "radialMenu";


	Y.extend(RadialMenu, Y.Overlay, {
		_isKeyPressed: false,

		_selectedPanel: null,
		
		_nodeClickHandle: null,

		_keyDownHandle: null,
		_keyUpHandle: null,

		_timerKeyDown: null,

		/**
		 * Callback function for clicking inside the widget node.
		 * @method _handleClick
		 * @param e {Event} Required. The triggered `click` JavaScript event.
		 * @private
		 */
		_handleClick: function(e) {
			var panels = this.get('panels'),
				targ = e.target,
				node = targ.hasClass(CLS_PANEL) ? targ : targ.ancestor('.' + CLS_PANEL),
				panel, i;

			if (node) {
				panel = _getPanel(panels, node);
				
				if (panel) {
					e.halt();
					i = panel.get('index');
					this.fire('panelClicked', panel.get('boundingBox'), panel);
					this.fire('panelClicked' + i, panel.get('boundingBox'), panel);
				}
			}

			if (this.get('closeOnClick')) {this.hide();}
		},

		/**
		 * Callback function for pressing a key while the menu is open.
		 * @method _handleKeyDown
		 * @param e {Event} Required. The triggered `keydown` JavaScript event.
		 * @private
		 */
		_handleKeyDown: function(e) {
			var panels = this.get('panels'),
				selectedPanel = this._selectedPanel,
				i = selectedPanel ? selectedPanel.get('index') : 0,
				n = panels.length,
				isValid = false,
				m, l=n%2;

			// todo: this logic could be improved by checking if the next position is further in the direction the user is trying to go; this would fix the corner-case issues

			switch (e.keyCode) {
				case 38: // up
					if (0 != i) {
					isValid = true;
						if (n / 2 > i) {
							i -= 1;
						}
						else {
							i += 1;
						}
					}
				break;

				case 39: // right
					m = n / 4;

					if (m != i && ! (l && _isBetween(i, m-1, m+1))) {
					isValid = true;
						if (m >= i + 1 || n - m <= i) {
							i += 1;
						}
						else if (m <= i - 1) {
							i -= 1;
						}
					}
				break;

				case 40: // down
					m = n / 2;

					if (m != i && ! (l && _isBetween(i, m-1, m+1))) {
					isValid = true;
						if (m >= i + 1) {
							i += 1;
						}
						else if (m <= i - 1) {
							i -= 1;
						}
					}
				break;

				case 37: // left
					m = n / 4;

					if (n - m != i && ! (l && _isBetween(i, n-m-1, n-m+1))) {
					isValid = true;
						if (m < i && n - m >= i + 1) {
							i += 1;
						}
						else if (n - m <= i - 1 || i <= m) {
							i -= 1;
						}
					}
				break;

				case 13: // enter
					if (selectedPanel) {
						e.target = selectedPanel.get('boundingBox');
						this._handleClick(e);
					}
				break;

				case 27: // escape
					this.hide();
				break;
			}

			if (isValid) {
				_cancel(this._timerKeyDown);

				if (0 > i){
					i = n - 1;
				}
				else if (n - 1 < i) {
					i = 0;
				}


				n = this.get('keyHoldTimeout');
				if (0 < n) {
					this._timerKeyDown = Y.later(n, this, this._handleKeyDown, e);
				}
				if (selectedPanel) {selectedPanel._handleMouseLeave();}
				selectedPanel = panels[i];
				this._selectedPanel = selectedPanel;
				selectedPanel._handleMouseEnter();
				this._isKeyPressed = true;
			}
		},

		/**
		 * Callback function for releasing a key while the menu is open.
		 * @method _handleKeyUp
		 * @param e {Event} Required. The triggered `keyup` JavaScript event.
		 * @private
		 */
		_handleKeyUp: function(e) {
			_cancel(this._timerKeyDown);
			this._isKeyPressed = false;
		},

		/**
		 * @see Y.Widget.bindUI
		 */
		bindUI: function() {
			var _this = this,
				doc = document;

			if (! _this._keyDownHandle) {
				_this._keyDownHandle = Y.on('keydown', _bind(_this._handleKeyDown, _this), doc);
				_this._keyUpHandle = Y.on('keyup', _bind(_this._handleKeyUp, _this), doc);
				_this._nodeClickHandle = Y.on("click", _bind(_this._handleClick, _this), doc);
			}
		},

		/**
		 * @see Y.Base.destructor
		 */
		destructor: function() {
			this.hide();
		},

		/**
		 * @see Y.Widget.hide
		 */
		hide: function() {
			var _this = this;

			_detach(_this, '_nodeClickHandle');
			_detach(_this, '_keyDownHandle');
			_detach(_this, '_keyUpHandle');
			_cancel(_this._timerKeyDown);

			if (_this._selectedPanel) {
				_this._selectedPanel.syncUI();
				_this._selectedPanel = null;
			}

			Y.each(_this.get('panels'), function(panel) {
				panel.hide();
			});

			RadialMenu.superclass.hide.apply(this, arguments);
		},

		/**
		 * @see Y.Base.initializer
		 */
		initializer: function(config) {
			this.get('boundingBox').setStyle('position', 'absolute');
		},

		/**
		 * @see Y.Widget.show
		 */
		show: function() {
			var _this = this,
				box, width, height;

			Y.later(1, _this, _this.bindUI);
			_this.syncUI(true);

			if (_this.get('useMask')) {
				box = _this.get('boundingBox');
				height = box.get('docHeight');
				width = box.get('docWidth');

				box.setStyle('height', height + 'px');
				box.setStyle('width', width + 'px');

				RadialMenu.superclass.show.apply(_this, arguments);
			}
		},

		/**
		 * @see Y.Widget.syncUI
		 */
		syncUI: function(isShow) {
			var _this = this,
				panels = _this.get('panels'),
				n = _this.get('panels').length,
				radius = _this.get('diameter') / 2,
				pt = _this.get('centerPoint'),
				angle = 360 / n,
				a, o, x, y, reg, viewport;

			if (! pt) {
				viewport = _this.get('boundingBox').get('viewportRegion');
				pt = [
					viewport.left + (viewport.width - 5) / 2,
					viewport.top + (viewport.height - 5) / 2
				];
			}

			if (! isShow) {this.hide();}

			Y.each(panels, function(panel, i) {
				reg = panel.get('boundingBox').get('region');
				a = (angle * i - 90) * Math.PI / 180;
				x = pt[0] + radius * Math.cos(a);
				y = pt[1] + radius * Math.sin(a);
				panel.set('xy', [x, y]);
				panel.set('index', i);
				panel.set('centerpt', [pt[0] - (reg.width / 2), pt[1] - (reg.height / 2)]);
				panel.set('radialpt', [x,y]);
				panel[panel.get('rendered') ? 'syncUI' : 'render']();
				panel[isShow ? 'show' : 'hide']();
				panel.after(panel._handleMouseEnter, function() {_this._selectedPanel = panel});
				panel.after(panel._handleMouseLeave, function() {_this._selectedPanel = null});
			}, _this);
		}
	});

Y.RadialMenu = RadialMenu;
}, '1.1.00' ,{requires:['overlay', 'collection', 'gallery-radial-menu-panel'], use: [], optional: ['gallery-radial-menu-anim']});