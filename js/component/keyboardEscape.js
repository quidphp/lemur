/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEscape
// component to catch or prevent the escape key on the keyboard
const KeyboardEscape = function(prevent,type)
{
    Component.Keyboard.call(this,'escape',[27],type);
    
    setFunc(this,'escape:prevent',function(event) {
        return (prevent === true)? true:false;
    });    
    
    return this;
}

// export
Component.KeyboardEscape = KeyboardEscape;