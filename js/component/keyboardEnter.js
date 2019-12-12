/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEnter
// component to catch or prevent the enter key on the keyboard
const KeyboardEnter = Component.KeyboardEnter = function(prevent,type)
{
    // keyboard
    Component.Keyboard.call(this,'enter',[10,13],type);
    
    
    // handler
    setHdlr(this,'keyboardEnter:prevent',function() {
        return (prevent === true)? true:false;
    });        
    
    return this;
}