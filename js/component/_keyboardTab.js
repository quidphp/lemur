/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardTab
// attrape la touche tab, par défaut l'événement est prevent
Component.keyboardTab = function(prevent,type)
{
    Component.keyboard.call(this,'tab',[9],type);
    
    $(this).on('tab:prevent', function(event) {
        return (prevent === true)? true:false;
    });    
    
    return this;
}