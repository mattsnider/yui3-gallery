/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * There are three major improvements I would like to make to this widget. The first is to leverage the existing overlay infrastructure
 * that is built into YUI3. This way we can leverage existing shimming and positioning architecture. The second is to animate the menu.
 * I believe the menu should rotate out from the center when opened and rotate in the center when closed. Lastly, the menu needs keyboard support.
 * Although the keyboard is not the same as a gaming controller, I believe the RadialMenuAnim lends itself to keyboard interaction.
 */

/**
 * The RadialMenuAnim classes manages a the radio menu.
 * @class RadialMenuAnim
 */
YUI().add('gallery-radial-menu-anim', function(Y) {
	// constants
var Lang = Y.Lang,

    /**
     * The RadialMenu constructor.
     * @method RadialMenuAnim
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	RadialMenuAnim = function(conf) {
		RadialMenuAnim.superclass.constructor.apply(this, arguments);
		this._enabled = true;
	};

	RadialMenuAnim.ATTRS = {
		animType: {
			value: 'radiate',
			validate: function(val) {
				return 'rotate' == val || 'radiate' == val;
			}
		},

		duration: {
			value: 1,
			validate: Lang.isNumber
		},

		easingIn: {
			value: Y.Easing.elasticIn
		},

		easingOut: {
			value: Y.Easing.elasticOut
		},

		rotation: {
			value: 90,
			validate: Lang.isNumber
		}
	};

	RadialMenuAnim.NS = "radialMenuAnim";


	Y.extend(RadialMenuAnim, Y.Plugin.Base, {
		_enabled: null,

		animClosed: function() {
			if (!this._enabled) {return;}
			var host = this.get('host'),
				panels = host.get('panels'),
				fnName = this.get('animType') + 'In',
				n = panels.length,
				duration = this.get('duration'),
				easing = this.get('easingIn');

			Y.each(panels,function(panel, i) {
				panel.show();
				var anim = new Y.Anim({duration: duration, easing: easing, node: panel.get('boundingBox')});
				this[fnName](anim, panel.get('centerpt'), panel.get('radialpt'));
				anim.on('end', Y.bind(panel.hide, panel));
				anim.run();
			}, this);
		},

		animOpen: function() {
			if (!this._enabled) {return;}
			var host = this.get('host'),
				panels = host.get('panels'),
				fnName = this.get('animType') + 'Out',
				duration = this.get('duration'),
				easing = this.get('easingOut');

			Y.each(panels,function(panel) {
				panel.show();
				var anim = new Y.Anim({duration: duration, easing: easing, node: panel.get('boundingBox')});
				this[fnName](anim, panel.get('centerpt'), panel.get('radialpt'));
				anim.run();
			}, this);
		},

		destructor: function() {

		},

		disable: function() {
			this._enabled = false;
		},

		enable: function() {
			this._enabled = true;
		},

		initializer: function() {
			var _this = this,
				_prefix = _this.get('animType');
			
			_this.doAfter('syncUI', _this.syncUI);
			_this.doAfter('hide', _this.animClosed);
			_this.doAfter('show', _this.animOpen);
		},

		radiateIn: function(anim, centerpt, radialpt) {
			anim.set('to', {
				left: centerpt[0],
				top: centerpt[1]
			});
		},

		radiateOut: function(anim, centerpt, radialpt) {
			anim.set('to', {
				left: radialpt[0],
				top: radialpt[1]
			});
		},

		rotateIn: function(anim, centerpt, radialpt) {
			anim.set('to', {
				curve: this.rotateInCurve(centerpt, radialpt)
			})
		},

		rotateInCurve: function(centerpt, radialpt) {
			var radius = this.get('host').get('diameter') / 2,
				rotation = this.get('rotation'),
				angle = ((centerpt[0] - radialpt[0]) / radius),
				points = [],
				i=0, n=10, astep = rotation / n, rstep = radius / n;

			for (0; i < n; i += 1) {
				points[i] = [
					Math.floor(centerpt[0] + radius * Math.cos(angle)),
					Math.floor(centerpt[1] + radius * Math.sin(angle))
				];

				angle -= astep;
				radius -= rstep;
			}

			points[i] = centerpt;
			return points;
		},

		rotateOut: function(anim, centerpt, radialpt) {
			anim.set('to', {
				curve: this.rotateOutCurve(centerpt, radialpt)
			})
		},

		rotateOutCurve: function(centerpt, radialpt) {
			var radius = this.get('host').get('diameter') / 2,
				rotation = this.get('rotation'),
				angle = ((radialpt[0] - centerpt[0]) / radius) - rotation,
				points = [],
				i=0, n=10, astep = rotation / n, rstep = radius / n;

			radius = rstep;
			angle = astep;

			for (1; i < n; i += 1) {
				points[i] = [
					Math.floor(centerpt[0] + radius * Math.cos(angle)),
					Math.floor(centerpt[1] + radius * Math.sin(angle))
				];

				angle += astep;
				radius += rstep;
			}

			points[i] = radialpt;
			return points;
		},

		syncUI: function(a) {
			if (!this._enabled) {return;}
			
			Y.each(this.get('host').get('panels'),function(panel) {
				var node = panel.get('boundingBox'),
					centerpt = panel.get('centerpt');
				node.setStyle('left', centerpt[0] + 'px');
				node.setStyle('top', centerpt[1] + 'px');
			});
		}
	});

Y.RadialMenuAnim = RadialMenuAnim;
}, '@VERSION@' ,{requires:['plugin', 'anim', 'gallery-radial-menu'], use: []});