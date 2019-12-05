/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// component to catch and/or prevent an event related to a key press on the keyboard
const Keyboard = function(key,values,type) 
{
    // nodes
    const $nodes = this;
    
    
    // type
    type = type || 'keydown';
    
    
    // event
    if(Str.isNotEmpty(key) && Arr.isNotEmpty(values))
    {
        ael(this,type,function(event) {
            if(Arr.in(event.keyCode,values))
            {
                const isInput = $(event.target).is(Selector.input());
                const catched = "keyboard:"+key+":catched";
                triggerCustom(this,catched,event,isInput,event.keyCode);
                
                const prevent = "keyboard:"+key+":prevent";
                if(triggerFunc(this,prevent,event,isInput,event.keyCode) === true)
                {
                    const blocked = "keyboard:"+key+":blocked";
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

// export
Component.Keyboard = Keyboard;