/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// alert
// lance un message d'alerte lorsqu'un événement est triggé
quid.component.alert = function(type)
{
    if(quid.str.isNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var alertText = $(this).data('alert');
            
            if(quid.str.isNotEmpty(alertText))
            alert(alertText);
        });
    }
    
    return this;
}