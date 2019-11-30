/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// script of behaviours for a keyboard component
// permet d'attraper une touche au clavier
// l'événement par défaut est keydown
quid.component.keyboard = function(key,values,type) {
    type = type || 'keydown';
    
    if(quid.str.isNotEmpty(key) && quid.arr.isNotEmpty(values))
    {
        $(this).on(type, function(event) {
            
            if(quid.arr.in(event.keyCode,values))
            {
                var isInput = $(event.target).is(quid.selector.input());
                var catched = key+":catched";
                $(this).trigger(catched,[event,isInput,event.keyCode]);
                
                var prevent = key+":prevent";
                if($(this).triggerHandler(prevent,[event,isInput,event.keyCode]) === true)
                {
                    var blocked = key+":blocked";
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    $(this).trigger(blocked,[event,isInput,event.keyCode]);
                    return false;
                }
            }
        })
    }
    
    return this;
}