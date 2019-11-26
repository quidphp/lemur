"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tableRelation
// script for a component to search and insert content within a textarea

// textarea
// génère un componennt textarea, avec possibilités d'insérer du contenu via tableRelation
quid.component.textarea = function()
{
    // triggerHandler
    $(this).on('textarea:getTextarea', function(event) {
        return $(this).find("textarea").first();
    })
    .on('textarea:getFilters', function(event) {
        return $(this).find(".table-relation");
    })
    .on('textarea:getTinymceEditor', function(event) {
        return $(this).triggerHandler('textarea:getTextarea').data('tinymceEditor');
    })
    .on('textarea:hasFilters', function(event) {
        return ($(this).triggerHandler('textarea:getFilters').length)? true:false;
    })
    .on('textarea:hasTinymce', function(event) {
        return ($(this).parents(".form-element").is("[data-group='tinymce']"))? true:false;
    })
    
    // setup
    .one('component:setup', function(event) {
        bindTextarea.call(this);
        
        if($(this).triggerHandler('textarea:hasFilters'))
        bindFilter.call(this);
        
        if($(this).triggerHandler('textarea:hasTinymce'))
        bindTinymce.call(this);
    })
    
    // teardown
    .one('component:teardown', function(event) {
        var editor = $(this).triggerHandler("textarea:getTinymceEditor");
        
        if(editor != null)
        editor.remove();
    });
    
    // bindTextarea
    var bindTextarea = function() {
        var textarea = $(this).triggerHandler('textarea:getTextarea');
        
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
        var filters = $(this).triggerHandler('textarea:getFilters');
        var textarea = $(this).triggerHandler('textarea:getTextarea');
        
        quid.core.filterGeneralFull.call(filters);
        filters.on('clickOpen:getBackgroundFrom',function(event) {
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
        .on('feed:bind', function(event) {
            var target = $(this).triggerHandler('clickOpen:getTarget');
            
            target.on('feed:parseData', function(event,data) {
                return quid.main.dom.parseHtml(data).find("li");
            })
        })
        .trigger('component:setup');
    };
    
    // bindTinymce
    var bindTinymce = function() {
        var textarea = $(this).triggerHandler('textarea:getTextarea');
        var data = textarea.data('tinymce') || { };
        var editor = quid.core.tinycme.call(textarea,data);
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
    
    return this;
}