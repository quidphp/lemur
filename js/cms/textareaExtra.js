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
            background: "tableRelation"
        }
    },option);
    
    
    // handler
    setHdlrs(this,'textareaExtra:',{
        
        hasFilters: function() {
            return (Arr.isNotEmpty(trigHdlr(this,'textareaExtra:getFilters')))? true:false;
        },
        
        hasTinymce: function() {
            return ($(this).parents(".form-element").is("[data-group='tinymce']"))? true:false;
        },
        
        getTextarea: function() {
            return qs(this,'textarea');
        },
        
        getFilters: function() {
            return qsa(this,'.table-relation');
        }
    });
    
    
    // event
    ael(this,'component:enable',function() {
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        enableTinycme.call(this);
    });
    
    ael(this,'component:disable',function() {
        if(trigHdlr(this,'textareaExtra:hasTinymce'))
        disableTinycme.call(this);
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
        unmountTinymce.call(this);
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
        const editor = createTinymce.call(textarea);
        setData(textarea,'tinymce-editor',editor);
        setHdlr(textarea,'textareaInput:insert',function(html) {
            let r = false;
            
            if(Str.isNotEmpty(html))
            {
                editor.execCommand('mceInsertContent',false,html);
                r = true;
            }
            
            return r;
        });
        
        setHdlr(this,'textareaExtra:getTinymceEditor',function() {
            const textarea = trigHdlr(this,'textareaExtra:getTextarea');
            return getData(textarea,'tinymce-editor');
        });
    }
    
    
    // unmountTinymce
    const unmountTinymce = function()
    {
        const editor = trigHdlr(this,"textareaExtra:getTinymceEditor");

        if(editor != null)
        editor.remove();
    }
    
    
    // enableTinycme
    const enableTinycme = function()
    {
        const editor = trigHdlr(this,"textareaExtra:getTinymceEditor");
        
        if(editor != null)
        editor.setMode('design');
    }
    
    
    // disableTinycme
    const disableTinycme = function()
    {
        const editor = trigHdlr(this,"textareaExtra:getTinymceEditor");
        
        if(editor != null)
        editor.setMode('readonly');
    }
    
    
    // createTinymce
    const createTinymce = function() 
    {
        let r = null;
        
        DomChange.addId('tinymce-',this);
        const id = $(this).prop('id');
        const data = getAttr(this,'data-tinymce',true) || {};
        data.selector = "#"+id;
        data.init_instance_callback = function (editor) {
            editor.on('Blur', function (e) {
                editor.save();
            });
        };
        tinymce.init(data);
        r = tinymce.get(id);
        
        return r;
    }
    
    return this;
}