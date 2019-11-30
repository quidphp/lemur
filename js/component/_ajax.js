/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// ajax
// charge un lien ou un formulaire via ajax
quid.component.ajax = function(type) 
{
    if(quid.str.isNotEmpty(type))
    {
        $(this).on(type, function(event) {
            event.stopPropagation();
            $(this).triggerHandler('ajax:trigger',[null,true,event]);
        })
        .on('ajax:progress ajax:beforeSend ajax:before ajax:success ajax:error ajax:complete', function(event) {
            event.stopPropagation();
        })
        .on('ajax:confirm', function(event) {
            return ($(document).triggerHandler('document:isLoading') === true)? false:true;
        })
        .on('ajax:trigger', function(event,config,tag,triggerEvent) {
            event.stopImmediatePropagation();
            var r = quid.xhr.trigger(this,config,tag);
            
            if(r !== false && triggerEvent)
            {
                triggerEvent.stopImmediatePropagation();
                triggerEvent.preventDefault();
            }
            
            return r;
        });
    }
    
    return this;
}