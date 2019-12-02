/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardTab
// component to catch or prevent the tab key on the keyboard
const KeyboardTab = function(prevent,type)
{
    Component.Keyboard.call(this,'tab',[9],type);
    
    setFunc(this,'tab:prevent',function(event) {
        return (prevent === true)? true:false;
    });    
    
    return this;
}

// export
Component.KeyboardTab = KeyboardTab;