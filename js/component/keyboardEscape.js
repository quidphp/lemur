/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEscape
// component to catchan escape key press on the keyboard
Component.keyboardEscape = function(prevent,type)
{
    Component.keyboard.call(this,'escape',[27],type);
    
    setFunc(this,'escape:prevent', function(event) {
        return (prevent === true)? true:false;
    });    
    
    return this;
}