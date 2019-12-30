/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// component to catch and/or prevent an event related to a key press on the keyboard
Component.Keyboard = function(key,values,type) 
{   
    // check
    if(Vari.isEmpty(this) || !Str.isNotEmpty(key) || !Arr.isNotEmpty(values))
    return null;


    // type
    type = type || 'keydown';
    
    
    // event
    ael(this,type,function(event) {
        if(Arr.in(event.keyCode,values))
        {
            const isInput = Nod.match(event.target,Dom.selectorInput(true));
            const ucKey = Str.upperFirst(key);
            const catched = "keyboard"+ucKey+":catched";
            trigEvt(this,catched,event,isInput,event.keyCode);
            
            const prevent = "keyboard"+ucKey+":prevent";
            if(trigHdlr(this,prevent,event,isInput,event.keyCode) === true)
            {
                const blocked = "keyboard"+ucKey+":blocked";
                Evt.preventStop(event,true);
                trigEvt(this,blocked,event,isInput,event.keyCode);
                
                return false;
            }
        }
    });
    
    return this;
}