/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEscape
// component to catch or prevent the escape key on the keyboard
const KeyboardEscape = function(prevent,type)
{
    // nodes
    const $nodes = this;
    
    
    // keyboard
    Component.Keyboard.call(this,'escape',[27],type);
    
    
    // func
    setFunc(this,'keyboard:escape:prevent',function() {
        return (prevent === true)? true:false;
    });    
    
    return this;
}

// export
Component.KeyboardEscape = KeyboardEscape;