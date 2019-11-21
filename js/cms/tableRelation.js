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
    $(this).on('tableRelation:getFilters', function(event) {
        return $(this).find(".table-relation")
    })
    .on('tableRelation:getTextarea', function(event) {
        return $(this).find("textarea").first();
    })
    .on('tableRelation:bind', function(event) {
        var textarea = $(this).triggerHandler('tableRelation:getTextarea');;
        var filters = $(this).triggerHandler('tableRelation:getFilters');

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
        
        quid.core.filterGeneralFull.call(filters);
        filters.on('tableRelationFilter:bind', function(event) {
            $(this).trigger('filterGeneralFull:bind');
            
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
        .on('feed:bind', function(event) {
            var target = $(this).triggerHandler('clickOpen:getTarget');
            
            target.on('feed:parseData', function(event,data) {
                return quid.main.dom.parseHtml(data).find("li");
            })
        })
        .trigger('tableRelationFilter:bind');
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