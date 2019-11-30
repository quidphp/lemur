/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// confirm
// demande une confirmation ou bloque l'événement
Quid.Component.confirm = function(type) 
{
    if(Quid.Str.isNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var confirmText = $(this).data('confirm');
            
            if(Quid.Str.isNotEmpty(confirmText) && !confirm(confirmText))
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('notConfirmed',[event]);
                return false;
            }
            
            else
            $(this).trigger('confirmed',[event]);
        });
    }
    
    return this;
}