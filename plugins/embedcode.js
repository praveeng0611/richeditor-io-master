$.Richeditorio.prototype.embedcode = function() {
    return {
        langs: {
            de: {
                "embedcode": "embedvaCodava"
            },
            en: {
                "embedcode": "embedcode"
            }
        },
        getTemplate: function(action){
            var buttonName = 'Update';
            if(action === 'insert'){
                var buttonName = 'Insert'
            }
            var template = '<section id="richeditorio-modal-embedcode">'
                +'<textarea id="embed-code" rows="6" cols="4" style="height:100px;margin-bottom: 20px;"></textarea>'

                +'<section>'
                +'<label class="richeditorio-figure-position-option">Embed ' + this.lang.get('image-position') + '</label>'
                +'<select class="richeditorio-figure-position-option" id="richeditorio-figure-align" aria-label="' + this.lang.get('image-position') + '">'
                    + '<option value="none">' + this.lang.get('none') + '</option>'
                    + '<option value="left">' + this.lang.get('left') + '</option>'
                    + '<option value="center">' + this.lang.get('center') + '</option>'
                    + '<option value="right">' + this.lang.get('right') + '</option>'
                + '</select>'
                + '</section>'
                + '<button id="'+this.opts.classPrefix+'-modal-button-action">' +buttonName + '</button>'
                + '<button id="'+this.opts.classPrefix+'-modal-button-cancel">Cancel</button>'
                +'</section>';
            return template;

        },
        init: function() {
            var button = this.button.add('embedcode', this.lang.get('embedcode'));
            this.button.setIcon(button, '<i class="fa fa-code"></i>');
            this.button.addCallback(button, this.embedcode.show);
        },
        show: function() {
            this.modal.addTemplate('embedcode',this.embedcode.getTemplate('insert'));
            this.modal.load('embedcode', 'Insert Embed Code', 700);
            var button = this.modal.getActionButton();
            button.on('click', this.embedcode.insert);
            this.selection.save();
            this.modal.show();
            $('#mymodal-textarea').focus();
        },
        insert:function()
        {
            var $html = this.figure.get('embedcode',$('#embed-code').val());
            this.modal.close();
            console.log($html[0].outerHTML);
            this.insert.html($html[0].outerHTML);
            this.code.sync();
        },
        actions: function($figure)
        {
            var $embedSpan = $figure.find('span');
            var editorOptions = $('<ul contenteditable="false" id="richeditorio-figure-options"></ul>');

            // edit embedcode
            this.embedcode.edittor = $('<li class="richeditorio-editBtn" data-richeditorio="verified">'+ this.lang.get('edit') + '</li>');
            this.embedcode.edittor.on('click', $.proxy(function(){this.embedcode.showEdit($figure);}, this));
            editorOptions.append(this.embedcode.edittor);

            // delete embedcode
            this.embedcode.delete = $('<li class="richeditorio-editBtn" data-richeditorio="verified">'+ this.lang.get('delete') + '</li>');
            this.embedcode.delete.on('click', $.proxy(function(){this.figure.remove($figure); this.button.enableAll();}, this));
            editorOptions.append(this.embedcode.delete);

            return editorOptions;
        },
        showEdit : function($figure){
            this.modal.addTemplate('embedcode',this.embedcode.getTemplate('update'));
            this.modal.load('embedcode', 'Update Embed Code', 700);
            $('#embed-code').val($figure.find('.embed-span').html());
            var button = this.modal.getActionButton();
            button.on('click', this.embedcode.update($figure));
            this.selection.save();
            this.modal.show();
            $('#embed-code').focus();
        },
        update : function($figure)
        {


            return console.log('working update');

        }


    };
};