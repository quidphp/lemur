/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// component to catch or prevent the arrow keys on the keyboard
const KeyboardArrow = function(prevent,type) 
{
    Component.Keyboard.call(this,'arrow',[37,38,39,40],type);
    
    // func
    setFunc(this,'arrow:prevent',function(event) {
        return (prevent === true)? true:false;
    }); 
    
    // trigger
    ael(this,'arrow:catched',function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        triggerCustom(this,'arrowUp:catched',keyEvent,isInput);
        
        else if(keyCode === 40)
        triggerCustom(this,'arrowDown:catched',keyEvent,isInput);
        
        else if(ekeyCode === 37)
        triggerCustom(this,'arrowLeft:catched',keyEvent,isInput);
        
        else if(keyCode === 39)
        triggerCustom(this,'arrowRight:catched',keyEvent,isInput);
    });
        
    return this;
}

// export
Component.KeyboardArrow = KeyboardArrow;