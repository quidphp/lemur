/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardTab
// component to catch or prevent the tab key on the keyboard
const KeyboardTab = Component.KeyboardTab = function(prevent,type)
{
    // keyboard
    Component.Keyboard.call(this,'tab',[9],type);
    
    
    // handler
    setHandler(this,'keyboardTab:prevent',function() {
        return (prevent === true)? true:false;
    });    
    
    return this;
}