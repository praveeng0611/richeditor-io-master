$.Richeditorio.prototype.fontsize = function() {
	return {
		langs: {
			en: {
				"fontsize": "Font Size",
				"fontsize_remove": "Remove Fontsize"
			}
		},
		init: function() {
			if (!this.opts.fontsize) return;
			var fonts = this.opts.fontsize;
			
			var that = this;
			var dropdown = {};
			
			$.each(fonts, function(i, s) {
				dropdown['s' + i] = {
					title: s,
					func: function() {
						that.fontsize.set(s);
					},
                    observe: {
                        element: 'span[style*="font-size: '+s+';"]',
                        in: {
                            attr: {
                                'class': 'richeditorio-dropdown-link-inactive',
                                'aria-disabled': true
                            }
                        }
                    }
				};
			});
			
			dropdown['s' + fonts.length] = {
				title: this.lang.get('fontsize_remove'),
				func: function() {
					that.fontsize.remove();
				},
                observe: {
                    element: 'span[style*="font-size"]',
                    out: {
                        attr: {
                            'class': 'richeditorio-dropdown-link-inactive',
                            'aria-disabled': true
                        }
                    }
                }
			};
			
			var button = this.button.add('fontsize', this.lang.get('fontsize'));
			this.button.setIcon(button, '<i class="re-icon-fontsize"></i>');
			this.button.addDropdown(button, dropdown);
		},
		set: function(size) {
			this.inline.format('span', 'style', 'font-size: ' + size + ';');
		},
		remove: function() {
			this.inline.removeStyleRule('font-size');
		}
	};
};