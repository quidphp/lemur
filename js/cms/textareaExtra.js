/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// textareaExtra
// script for a component to search and insert content within a textarea, with support for tinymce
const TextareaExtra = Component.TextareaExtra = function()
{
    // setup
    aelOnce(this,'component:setup',function() {
        /*
        bindTextarea.call(this);
        
        if(trigHdlr(this,'textareaExtra:hasFilters'))
        bindFilter.call(this);
        
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        bindTinymce.call(this);
        */
    })
    
    
    // teardown
    aelOnce(this,'component:teardown',function() {
        /*
        const editor = trigHdlr(this,"textareaExtra:getTinymceEditor");
        
        if(editor != null)
        editor.remove();
        */
    });
    
    
    /*
    // triggerHandler
    $(this).on('textareaExtra:getTextarea',function() {
        return $(this).find("textarea").get(0);
    })
    .on('textareaExtra:getFilters',function() {
        return $(this).find(".table-relation");
    })
    .on('textareaExtra:getTinymceEditor',function() {
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        return getData(textarea,'tinymce-editor');
    })
    .on('textareaExtra:hasFilters',function() {
        return (trigHdlr(this,'textareaExtra:getFilters').length)? true:false;
    })
    .on('textareaExtra:hasTinymce',function() {
        return ($(this).parents(".form-element").is("[data-group='tinymce']"))? true:false;
    })
    
    // bindTextarea
    const bindTextarea = function() {
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        
        textarea.on('textareaInput:insert',function(event,html) {
            let r = false;
            
            if(Str.isNotEmpty(html))
            {
                r = true;
                const current = $(this).val();
                textarea.val(current+html);
            }
            
            return r;
        });
    };
    
    // bindFilter
    const bindFilter = function() {
        const filters = trigHdlr(this,'textareaExtra:getFilters');
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        
        Component.filter.call(filters);
        filters.on('clickOpen:getBackgroundFrom',function() {
            return 'tableRelation';
        })
        .one('component:setup',function(event) {
            trigEvt(this,'component:setup');
            
            const clickOpen = trigHdlr(this,'clickOpen:getTarget');
            const result = trigHdlr(this,'filter:getResult');
            
            result.on('click', '.insert',function(event) {
                const html = getAttr(this,'data-html');
                textarea.trigHdlr('textareaInput:insert',html);
                clickOpen.trigger('clickOpen:close');
                event.stopPropagation();
            });
            
            event.stopPropagation();
        })
        .on('feed:bind',function() {
            const target = trigHdlr(this,'clickOpen:getTarget');
            
            target.on('feed:parseData',function(event,data) {
                return Html.parse(data).find("li");
            })
        })
        .trigger('component:setup');
    };
    
    // bindTinymce
    const bindTinymce = function() {
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        const editor = createTinymce.call(textarea);
        setData(textarea,'tinymce-editor',editor);
        
        textarea.on('textareaInput:insert',function(event,html) {
            let r = false;
            
            if(Str.isNotEmpty(html))
            {
                editor.execCommand('mceInsertContent',false,html);
                r = true;
            }
            
            return r;
        });
    }
    
    // createTinymce
    const createTinymce = function() {
        let r = null;
        
        DomChange.addId('tinymce-',this);
        const id = this.prop('id');
        const data = getAttr(this,'data-tinymce') || {};
        
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
    */
    
    return this;
}