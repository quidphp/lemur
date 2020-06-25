/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// textareaExtra
// script for a component to search and insert content within a textarea, with support for tinymce
Component.TextareaExtra = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        filter: {
            trigger: ".trigger",
            target: ".popup",
            background: "tableRelation",
            focusableTarget: "button.insert",
            parse: null
        },
        tinymce: {}
    },option);
    
    
    // handler
    setHdlrs(this,'textareaExtra:',{
        
        hasFilters: function() {
            return Arr.isNotEmpty(trigHdlr(this,'textareaExtra:getFilters'));
        },
        
        hasTinymce: function() {
            const parent = Ele.closest(this,".form-element");
            return Ele.match(parent,"[data-group='tinymce']");
        },
        
        getTextarea: function() {
            return qs(this,'textarea',true);
        },
        
        getFilters: function() {
            return qsa(this,'.table-relation');
        }
    });
    
    
    // event
    ael(this,'component:enable',function() {
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        {
            const textarea = trigHdlr(this,'textareaExtra:getTextarea');
            trigHdlr(textarea,'tinymce:enable');
        }
    });
    
    ael(this,'component:disable',function() {
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        {
            const textarea = trigHdlr(this,'textareaExtra:getTextarea');
            trigHdlr(textarea,'tinymce:disable');
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindTextarea.call(this);
        
        if(trigHdlr(this,'textareaExtra:hasFilters'))
        bindFilter.call(this);
        
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        mountTinymce.call(this);
    })
    
    
    // teardown
    aelOnce(this,'component:teardown',function() {
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        {
            const textarea = trigHdlr(this,'textareaExtra:getTextarea');
            trigTeardown(textarea);
        }
    });
    
    
    // bindTextarea
    const bindTextarea = function() 
    {
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        
        setHdlr(textarea,'textareaInput:insert',function(html) {
            let r = false;
            
            if(Str.isNotEmpty(html))
            {
                r = true;
                trigHdlr(this,'input:appendValue',html);
            }
            
            return r;
        });
    }
    
    
    // bindFilter
    const bindFilter = function() 
    {
        const filters = trigHdlr(this,'textareaExtra:getFilters');
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        
        Component.Filter.call(filters,$option.filter);
        
        aelOnce(filters,'component:setup',function() {
            const $this = this;
            const result = trigHdlr(this,'feedSearch:getResult');
            
            aelDelegate(result,'click','.insert',function(event) {
                const html = getAttr(this,'data-html');
                trigHdlr(textarea,'textareaInput:insert',html);
                trigEvt($this,'clickOpen:close');
            });
        });
        
        trigSetup(filters);
    }
    
    
    // mountTinymce
    const mountTinymce = function() 
    {
        const textarea = trigHdlr(this,'textareaExtra:getTextarea');
        trigSetup(Component.Tinymce.call(textarea,$option.tinymce));
        
        setHdlr(textarea,'textareaInput:insert',function(html) {
            let r = false;
            
            if(Str.isNotEmpty(html))
            {
                const editor = trigHdlr(textarea,'tinymce:get');
                
                if(editor != null)
                {
                    editor.execCommand('mceInsertContent',false,html);
                    r = true;
                }
            }
            
            return r;
        });
    }
        
    return this;
}