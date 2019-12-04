/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEnter
// component to catch or prevent the enter key on the keyboard
const KeyboardEnter = function(prevent,type)
{
    // nodes
    const $nodes = this;
    
    
    // keyboard
    Component.Keyboard.call(this,'enter',[10,13],type);
    
    
    // func
    setFunc(this,'keyboard:enter:prevent',function() {
        return (prevent === true)? true:false;
    });        
    
    return this;
}

// export
Component.KeyboardEnter = KeyboardEnter;