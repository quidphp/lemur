/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEscape
// component to catch or prevent the escape key on the keyboard
const KeyboardEscape = Component.KeyboardEscape = function(prevent,type)
{
    // keyboard
    Component.Keyboard.call(this,'escape',[27],type);
    
    
    // func
    setFunc(this,'keyboardEscape:prevent',function() {
        return (prevent === true)? true:false;
    });    
    
    return this;
}