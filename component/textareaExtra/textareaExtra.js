"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// textareaExtra
// script for a component to search and insert content within a textarea, with support for tinymce
quid.component.textareaExtra = function()
{
    // triggerHandler
    $(this).on('textareaExtra:getTextarea', function() {
        return $(this).find("textarea").first();
    })
    .on('textareaExtra:getFilters', function() {
        return $(this).find(".table-relation");
    })
    .on('textareaExtra:getTinymceEditor', function() {
        return $(this).triggerHandler('textareaExtra:getTextarea').data('tinymceEditor');
    })
    .on('textareaExtra:hasFilters', function() {
        return ($(this).triggerHandler('textareaExtra:getFilters').length)? true:false;
    })
    .on('textareaExtra:hasTinymce', function() {
        return ($(this).parents(".form-element").is("[data-group='tinymce']"))? true:false;
    })
    
    // setup
    .one('component:setup', function() {
        bindTextarea.call(this);
        
        if($(this).triggerHandler('textareaExtra:hasFilters'))
        bindFilter.call(this);
        
        if($(this).triggerHandler('textareaExtra:hasTinymce'))
        bindTinymce.call(this);
    })
    
    // teardown
    .one('component:teardown', function() {
        var editor = $(this).triggerHandler("textareaExtra:getTinymceEditor");
        
        if(editor != null)
        editor.remove();
    });
    
    // bindTextarea
    var bindTextarea = function() {
        var textarea = $(this).triggerHandler('textareaExtra:getTextarea');
        
        textarea.on('textareaInput:insert', function(event,html) {
            var r = false;
            
            if(quid.base.str.isNotEmpty(html))
            {
                r = true;
                var current = $(this).val();
                textarea.val(current+html);
            }
            
            return r;
        });
    };
    
    // bindFilter
    var bindFilter = function() {
        var filters = $(this).triggerHandler('textareaExtra:getFilters');
        var textarea = $(this).triggerHandler('textareaExtra:getTextarea');
        
        quid.core.filterGeneralFull.call(filters);
        filters.on('clickOpen:getBackgroundFrom',function() {
            return 'tableRelation';
        })
        .one('component:setup', function(event) {
            $(this).trigger('component:setup');
            
            var clickOpen = $(this).triggerHandler('clickOpen:getTarget');
            var result = $(this).triggerHandler('filter:getResult');
            
            result.on('click', '.insert', function(event) {
                var html = $(this).data('html');
                textarea.triggerHandler('textareaInput:insert',html);
                clickOpen.trigger('clickOpen:close');
                event.stopPropagation();
            });
            
            event.stopPropagation();
        })
        .on('feed:bind', function() {
            var target = $(this).triggerHandler('clickOpen:getTarget');
            
            target.on('feed:parseData', function(event,data) {
                return quid.main.dom.parseHtml(data).find("li");
            })
        })
        .trigger('component:setup');
    };
    
    // bindTinymce
    var bindTinymce = function() {
        var textarea = $(this).triggerHandler('textareaExtra:getTextarea');
        var editor = createTinymce.call(textarea);
        textarea.data('tinymceEditor',editor);
        
        textarea.on('textareaInput:insert', function(event,html) {
            var r = false;
            
            if(quid.base.str.isNotEmpty(html))
            {
                editor.execCommand('mceInsertContent',false,html);
                r = true;
            }
            
            return r;
        });
    }
    
    // createTinymce
    var createTinymce = function() {
        var r = null;
        
        quid.main.attr.addId.call(this,'tinymce');
        var id = this.prop('id');
        var data = this.data('tinymce') || {};
        
        data.selector = "#"+id;
        data.init_instance_callback = function (editor) {
            editor.on('Blur', function (e) {
                editor.save();
            });
        };
        tinymce.init(data);
        r = tinymce.get(id);
        
        return r;
    };
    
    return this;
}