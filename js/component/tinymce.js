/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tinymce
// component to manage a tinymce wysiwyg input
Component.Tinymce = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'tinymce:',{
        
        get: function() {
            return getData(this,'tinymce-editor');
        },
        
        unmount: function() {
            const editor = trigHdlr(this,"tinymce:get");

            if(editor != null)
            editor.remove();
        },
        
        enable: function() {
            const editor = trigHdlr(this,"tinymce:get");
            
            if(editor != null)
            editor.setMode('design');
        },
        
        disable: function() {
            const editor = trigHdlr(this,"tinymce:get");
            
            if(editor != null)
            editor.setMode('readonly');
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        createTinymce.call(this);
    });
    
    aelOnce(this,'component:teardown',function() {
        trigHdlr(this,'tinymce:unmount');
    });
    
    
    // createTinymce
    const createTinymce = function() 
    {
        Ele.addId(this,'tinymce-');
        const id = getProp(this,'id');
        const data = Pojo.replaceRecursive({},option,getAttr(this,'data-tinymce',true));
        
        data.selector = "#"+id;
        data.init_instance_callback = function (editor) {
            editor.on('Blur', function (e) {
                editor.save();
            });
        };
        
        const $this = this;

        tinymce.init(data);
        const editor = tinymce.get(id);
        setData(this,'tinymce-editor',editor);
    }
    
    return this;
}