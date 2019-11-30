/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// alert
// lance un message d'alerte lorsqu'un événement est triggé
Quid.Component.alert = function(type)
{
    if(Quid.Str.isNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var alertText = $(this).data('alert');
            
            if(Quid.Str.isNotEmpty(alertText))
            alert(alertText);
        });
    }
    
    return this;
}