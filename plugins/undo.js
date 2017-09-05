$.Richeditorio.prototype.undo = function() {
	return {
		langs: {
			de: {
				"undo": "Rückgängig"
			},
			en: {
				"undo": "Undo"
			}
		},
		init: function() {
			var button = this.button.add('undo', this.lang.get('undo'));
			this.button.setIcon(button, '<i class="re-icon-undo"></i>');
			this.button.addCallback(button, this.buffer.undo);
		}
	};
};