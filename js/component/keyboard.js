/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// component to catch and/or prevent an event related to a key press on the keyboard
const Keyboard = Component.Keyboard = function(key,values,type) 
{
    // type
    type = type || 'keydown';
    
    
    // event
    if(Str.isNotEmpty(key) && Arr.isNotEmpty(values))
    {
        ael(this,type,function(event) {
            if(Arr.in(event.keyCode,values))
            {
                const isInput = $(event.target).is(Selector.input());
                const ucKey = Str.upperFirst(key);
                const catched = "keyboard"+ucKey+":catched";
                triggerEvent(this,catched,event,isInput,event.keyCode);
                
                const prevent = "keyboard"+ucKey+":prevent";
                if(triggerFunc(this,prevent,event,isInput,event.keyCode) === true)
                {
                    const blocked = "keyboard"+ucKey+":blocked";
                    Evt.preventStop(event,true);
                    triggerEvent(this,blocked,event,isInput,event.keyCode);
                    
                    return false;
                }
            }
        });
    }
    
    return this;
}