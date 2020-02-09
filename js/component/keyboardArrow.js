/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// component to catch or prevent the arrow keys on the keyboard
Component.KeyboardArrow = function(prevent,type) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // keyboard
    Component.Keyboard.call(this,'arrow',[37,38,39,40],type);
    
    
    // handler
    setHdlr(this,'keyboardArrow:prevent',function(keyEvent,isInput,keyCode) {
        return trigHdlr(this,'keyboardArrow:preventBool',keyEvent,isInput,keyCode);
    });
    
    setHdlr(this,'keyboardArrow:preventBool',function(keyEvent,isInput,keyCode) {
        let r = false;
        
        if(prevent === true)
        r = true;
        
        else if(prevent === 'notInput' && isInput === false)
        r = true;
        
        else if(prevent === 'vertical' && Arr.in(keyCode,[38,40]))
        r = true;
        
        else if(prevent === 'verticalNotInput' && isInput === false && Arr.in(keyCode,[38,40]))
        r = true;
        
        else if(prevent === 'horizontal' && Arr.in(keyCode,[37,39]))
        r = true;
        
        else if(prevent === 'horizontalNotInput' && isInput === false && Arr.in(keyCode,[37,39]))
        r = true;
        
        return r;
    }); 
    
    
    // event
    ael(this,'keyboardArrow:blocked',function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        trigEvt(this,'keyboardArrow:up',keyEvent,isInput);
        
        else if(keyCode === 40)
        trigEvt(this,'keyboardArrow:down',keyEvent,isInput);
        
        else if(keyCode === 37)
        trigEvt(this,'keyboardArrow:left',keyEvent,isInput);
        
        else if(keyCode === 39)
        trigEvt(this,'keyboardArrow:right',keyEvent,isInput);
    });
        
    return this;
}