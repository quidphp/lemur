/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// confirm
// demande une confirmation ou bloque l'événement
Component.confirm = function(type) 
{
    if(Str.isNotEmpty(type))
    {
        $(this).on(type,function(event) {
            const confirmText = $(this).data('confirm');
            
            if(Str.isNotEmpty(confirmText) && !confirm(confirmText))
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                triggerCustom(this,'notConfirmed',event);
                return false;
            }
            
            else
            triggerCustom(this,'confirmed',event);
        });
    }
    
    return this;
}