/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardEscape
// attrape la touche escape, par défaut l'événement est prevent
quid.component.keyboardEscape = function(prevent,type)
{
    quid.component.keyboard.call(this,'escape',[27],type);
    
    $(this).on('escape:prevent', function(event) {
        return (prevent === true)? true:false;
    });    
    
    return this;
}