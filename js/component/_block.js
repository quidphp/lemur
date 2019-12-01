/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// block
// script of behaviours for a block component
// bloque l'événement sur le ou les éléments s'il y a la data blocked
Component.block = function(type) 
{
    if(Str.isNotEmpty(type))
    {
        const binded = $(this).data('blockBind:'+type);
        
        if(binded == null)
        {
            $(this).data('blockBind:'+type,true);
            
            $(this).on(type, function(event) 
            {
                if($(this).data("blocked") != null)
                {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    triggerCustom(this,'blocked');
                    return false;
                }
            })
            .on('block', function(event) {
                event.stopImmediatePropagation();
                $(this).data("blocked",true);
            })
            .on('unblock', function(event) {
                event.stopImmediatePropagation();
                $(this).removeData("blocked");
            })
        }
    }
    
    return this;
}