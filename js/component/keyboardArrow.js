/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// component to catch or prevent the arrow keys on the keyboard
const KeyboardArrow = Component.KeyboardArrow = function(prevent,type) 
{
    // keyboard
    Component.Keyboard.call(this,'arrow',[37,38,39,40],type);
    
    
    // handler
    setHdlr(this,'keyboardArrow:prevent',function() {
        return (prevent === true)? true:false;
    }); 
    
    
    // event
    ael(this,'keyboardArrow:catched',function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        trigEvt(this,'keyboardArrow:up',keyEvent,isInput);
        
        else if(keyCode === 40)
        trigEvt(this,'keyboardArrow:down',keyEvent,isInput);
        
        else if(ekeyCode === 37)
        trigEvt(this,'keyboardArrow:left',keyEvent,isInput);
        
        else if(keyCode === 39)
        trigEvt(this,'keyboardArrow:right',keyEvent,isInput);
    });
        
    return this;
}