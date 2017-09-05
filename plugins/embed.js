$.Richeditorio.prototype.embed = function() {
    return {
        langs: {
            en: {
                "embed": "Add an Embed",
                "embed-edit": "Edit Embed",
                "enter-url": "Enter URL here"
            }
        },
        getTemplate: function(edit)
        {
            edit = edit || false;
            var temp =  String()
                + '<div class="modal-section" id="richeditorio-modal-embed">'
                    + '<section>'
                        + '<label>' + this.lang.get('enter-url') + '</label>'
                        + '<input class="form-control" type="text" id="richeditorio_embed_url">'
                    + '</section>';
            if(edit)
            {
                temp += '<section>'
                            + '<label>' + this.lang.get('caption') + '</label>'
                            + '<input type="text" id="richeditorio-figure-caption" aria-label="' + this.lang.get('caption') + '" />'
                        + '</section>'
                        + '<section>'
                            + '<label class="richeditorio-figure-position-option">' + this.lang.get('image-position') + '</label>'
                            + '<select class="richeditorio-figure-position-option" id="richeditorio-figure-align" aria-label="' + this.lang.get('image-position') + '">'
                                + '<option value="none">' + this.lang.get('none') + '</option>'
                                + '<option value="left">' + this.lang.get('left') + '</option>'
                                + '<option value="center">' + this.lang.get('center') + '</option>'
                                + '<option value="right">' + this.lang.get('right') + '</option>'
                            + '</select>'
                        + '</section>'
            }
            temp += '<section>'
                        + '<button id="richeditorio-modal-button-action">Insert</button>'
                        + '<button id="richeditorio-modal-button-cancel">Cancel</button>'
                    + '</section>'
                + '</div>';
            return temp;
        },
        init: function ()
        {
            var button = this.button.add('embed', 'Embed URL/Social Media Post');
            this.button.setIcon(button, '<i class="re-icon-fontfamily"></i>');
            this.button.addCallback(button, this.embed.show);
        },
        show: function()
        {
            this.modal.addTemplate('embed', this.embed.getTemplate());
            this.modal.load('embed', this.lang.get('embed'), 700);

            this.modal.getActionButton().text(this.lang.get('insert')).on('click', this.embed.insert);

            this.selection.save();
            this.modal.show();

            // focus
            if (this.detect.isDesktop())
            {
                setTimeout(function()
                {
                    $('#richeditorio_embed_url').focus();
                }, 1);
            }

        },
        showEdit: function($figure)
        {
            this.observe.embed = $figure;
            this.modal.addTemplate('embed', this.embed.getTemplate(true));
            this.modal.load('embed', this.lang.get('embed-edit'), 700);
            $('#richeditorio_embed_url').val(this.embed.url);

            this.embed.buttonSave = this.modal.getActionButton().text(this.lang.get('save'));
            this.embed.buttonSave.on('click', $.proxy(this.embed.update, this));

            if (this.opts.figureCaption === false)
            {
                $('#richeditorio-figure-caption').val('').hide().prev().hide();
            }
            else
            {
                var $ficaption = $figure.find('figcaption');
                if ($ficaption !== 0)
                {
                    $('#richeditorio-figure-caption').val($ficaption.text()).show();
                }
            }

            if (!this.opts.figurePosition)
            {
                $('.richeditorio-figure-position-option').hide();
            }
            else
            {
                var isCentered = ($figure.length !== 0) ? ($figure.css('text-align') === 'center') : ($figure.css('display') == 'block' && $figure.css('float') == 'none');
                var floatValue = (isCentered) ? 'center' : $figure.css('float');
                $('#richeditorio-figure-align').val(floatValue);
            }

            this.selection.save();
            this.modal.show();

            // focus
            if (this.detect.isDesktop())
            {
                $('#richeditorio_embed_url').focus();
            }
        },
        update: function()
        {
            var $figure = this.observe.embed;
            this.figure.setFloating($figure);

            this.figure.addCaption($figure);
            this.modal.close();

            // buffer
            this.buffer.set();
            this.observe.embed = false;

        },
        getEmbedJson: function(url)
        {
            if(url != '')
            {
                $.ajax({
                    url: this.opts.embedUrl+'?url='+url,
                    type: "GET",
                    async: false,
                    success: $.proxy(function(data)
                    {
                        return this.embed.buildEmbedHtml(data);
                    }, this),
                    error: $.proxy(function()
                    {
                        this.embed.showMessage('Error in Url')
                    }, this)
                });
            }
            else
                this.embed.showMessage('Please enter url');
        },
        buildEmbedHtml: function(data)
        {
            return String()
                + '<aside class="" >'
                + '<div class="link-embed">'
                + '<a target="_blank" href="'+ data.url.url +'">'
                + '<div class="link-body">'
                + '<div class="link_image raw" style="background: url('+ data.image.url +') no-repeat center center; background-size: cover;">'
                + '</div>'
                + '<div class="link_desc">'
                + '<h4>'+ data.title +'</h4><p>'+ data.description +'</p>'
                + '</div>'
                + '</div>'
                + '</a>'
                + '</div>'
                + '</aside>';
        },
        showMessage: function(message)
        {
            alert(message);
        },
        actions: function($figure)
        {
            var editorOptions = $('<ul contenteditable="false" id="richeditorio-figure-options"></ul>');

            // edittor
            this.embed.edittor = $('<li class="richeditorio-editBtn" data-richeditorio="verified">'+ this.lang.get('edit') + '</li>');
            this.embed.edittor.on('click', $.proxy(function(){this.embed.showEdit($figure);}, this));
            editorOptions.append(this.embed.edittor);

            // delete image
            this.embed.delete = $('<li class="richeditorio-editBtn" data-richeditorio="verified">'+ this.lang.get('delete') + '</li>');
            this.embed.delete.on('click', $.proxy(function(){this.figure.remove($figure); this.button.enableAll();}, this));
            editorOptions.append(this.embed.delete);

            return editorOptions;
        },
        insert: function()
        {
            this.embed.url = $.trim($('#richeditorio_embed_url').val());
            var $embed_figure = this.figure.get('embed');
            $embed_figure.append(this.embed.getEmbedJson(this.embed.url));
            this.modal.close();
            this.placeholder.hide();
            // buffer
            this.buffer.set();
            // insert
            this.air.collapsed();
            this.insert.placeHtml($embed_figure);
            this.code.sync();
        }
    };
};