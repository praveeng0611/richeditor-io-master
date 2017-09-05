$.Richeditorio.prototype.fontfamily = function() {
	return {
		langs: {
			en: {
				"fontfamily": "Font Family",
				"fontfamily_remove": "Remove Fontfamily"
			}
		},
		init: function () {
			if (!this.opts.fontfamily) return;
			var fonts = this.opts.fontfamily;
			
			var that = this;
			var dropdown = {};
			
			$.each(fonts, function(i, s) {
				dropdown['s' + i] = {
					title: s,
					func: function() {
						that.fontfamily.set(s);
					},
                    observe: {
                        element: 'span[data-font-family="'+s.toLowerCase().replace(/[^\w-]+/g,'')+'"]',
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
				title: this.lang.get('fontfamily_remove'),
				func: function() {
					that.fontfamily.remove();
				},
                observe: {
                    element: 'span[style*="font-family"]',
                    out: {
                        attr: {
                            'class': 'richeditorio-dropdown-link-inactive',
                            'aria-disabled': true
                        }
                    }
                }
			};
			
			var button = this.button.add('fontfamily', this.lang.get('fontfamily'));
			this.button.setIcon(button, '<i class="re-icon-fontfamily"></i>');
			this.button.addDropdown(button, dropdown);
		},
		set: function(value) {
            this.inline.format('span', 'style', 'font-family:' + value + ';');
            this.inline.addAttr('data-font-family', value.toLowerCase().replace(/[^\w-]+/g,''));
		},
		remove: function() {
			this.inline.removeStyleRule('font-family');
            this.inline.removeAttr('data-font-family');
		}
	};
};