/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEnter
// component to catch or prevent the enter key on the keyboard
const KeyboardEnter = function(prevent,type)
{
    Component.Keyboard.call(this,'enter',[10,13],type);
    
    setFunc(this,'enter:prevent',function(event) {
        return (prevent === true)? true:false;
    });        
    
    return this;
}

// export
Component.KeyboardEnter = KeyboardEnter;