/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// component to catch or prevent the arrow keys on the keyboard
const KeyboardArrow = function(prevent,type) 
{
    // nodes
    const $nodes = this;
    
    
    // keyboard
    Component.Keyboard.call(this,'arrow',[37,38,39,40],type);
    
    
    // func
    setFunc(this,'keyboard:arrow:prevent',function() {
        return (prevent === true)? true:false;
    }); 
    
    
    // custom event
    ael(this,'keyboard:arrow:catched',function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        triggerCustom(this,'keyboard:arrowUp:catched',keyEvent,isInput);
        
        else if(keyCode === 40)
        triggerCustom(this,'keyboard:arrowDown:catched',keyEvent,isInput);
        
        else if(ekeyCode === 37)
        triggerCustom(this,'keyboard:arrowLeft:catched',keyEvent,isInput);
        
        else if(keyCode === 39)
        triggerCustom(this,'keyboard:arrowRight:catched',keyEvent,isInput);
    });
        
    return this;
}

// export
Component.KeyboardArrow = KeyboardArrow;