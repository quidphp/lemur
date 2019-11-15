"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tableRelation
// script for a component to search and insert content within a textarea

// tableRelation
// génère un componennt pour insérer du contenu dans un textarea
quid.cms.tableRelation = function()
{
    $(this).each(function(index, el) {
        var filters = $(this).find(".table-relation");
        var textarea = $(this).find("textarea").first();
        
        textarea.on('textarea:insert', function(event,html) {
            var r = false;
            
            if(quid.base.str.isNotEmpty(html))
            {
                r = true;
                var current = $(this).val();
                textarea.val(current+html);
            }
            
            return r;
        });
        
        filters.callThis(quid.core.filterGeneralFull)
        .on('tableRelation:prepare', function(event) {
            var clickOpen = $(this).triggerHandler('clickOpen:getTarget');
            $(this).triggerHandler('filter:getResult').on('click', '.insert', function(event) {
                var html = $(this).data('html');
                textarea.triggerHandler('textarea:insert',html);
                clickOpen.trigger('clickOpen:close');
                event.stopPropagation();
            })
        })
        .on('clickOpen:getBackgroundFrom',function(event) {
            return 'tableRelation';
        })
        .trigger('tableRelation:prepare');
        
        filters.each(function(index, el) {
            $(this).triggerHandler('clickOpen:getTarget').on('feed:parseData', function(event,data) {
                return quid.main.dom.parseHtml(data).find("li");
            })
        });
    });
    
    return this;
}

// tinymceWithTableRelation
// génère un éditeur de texte tinycme avec les binding pour les table relation
quid.cms.tinymceWithTableRelation = function()
{
    $(this).each(function(index, el) {
        var target = $(this).find("textarea");
        var data = target.data('tinymce') || { };
        var hasTableRelation = $(this).parents(".form-element").is("[data-table-relation='1']");
        var editor = quid.core.tinycme.call(target,data);
        target.data('editor',editor);
        
        if(hasTableRelation === true)
        {
            var filters = $(this).find(".relations .filter");
            data.setup = function(editor) {
                editor.on('click', function(e) {
                  filters.trigger('clickOpen:close');
                });
            };
            
            target.on('textarea:insert', function(event,html) {
                var r = false;
                var editor = $(this).data('editor');
                
                if(quid.base.str.isNotEmpty(html) && editor)
                editor.execCommand('mceInsertContent',false,html);
                
                return r;
            });
        }
    });
    
    return this;
}