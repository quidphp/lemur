/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// alert
// lance un message d'alerte lorsqu'un événement est triggé
Component.alert = function(type)
{
    if(Str.isNotEmpty(type))
    {
        $(this).on(type,function(event) {
            const alertText = $(this).data('alert');
            
            if(Str.isNotEmpty(alertText))
            alert(alertText);
        });
    }
    
    return this;
}