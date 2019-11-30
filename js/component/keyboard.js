/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// component to catch and/or prevent an event related to a key press on the keyboard
Quid.Component.keyboard = function(key,values,type) 
{
    type = type || 'keydown';
    
    if(Quid.Str.isNotEmpty(key) && Quid.Arr.isNotEmpty(values))
    {
        ael(this,type,function(event) 
        {
            if(Quid.Arr.in(event.keyCode,values))
            {
                var isInput = $(event.target).is(Quid.Selector.input());
                var catched = key+":catched";
                triggerCustom(this,catched,event,isInput,event.keyCode);
                
                var prevent = key+":prevent";
                if(triggerFunc(this,prevent,event,isInput,event.keyCode) === true)
                {
                    var blocked = key+":blocked";
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    triggerCustom(this,blocked,event,isInput,event.keyCode);
                    
                    return false;
                }
            }
        });
    }
    
    return this;
}