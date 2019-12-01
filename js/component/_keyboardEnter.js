/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEnter
// attrape la touche enter, par défaut l'événement est prevent
Component.keyboardEnter = function(prevent,type)
{
    Component.keyboard.call(this,'enter',[10,13],type);
    
    $(this).on('enter:prevent', function(event) {
        return (prevent === true)? true:false;
    });        
    
    return this;
}