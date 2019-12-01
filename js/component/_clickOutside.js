/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOutside
// gère les clicks hors de l'éléments
// si parent n'est pas spécifié utilise document
// utilise le namespace outside, ceci est unbind dans navigation
Component.clickOutside = function(value,parent) 
{
    if(Str.isNotEmpty(value))
    {
        parent = (parent instanceof jQuery && parent.length === 1)? parent:$(document);
        const $this = $(this);
        
        parent.on('click.document-mount', function(event) {
            $this.trigger(value);
        });
    }
    
    return this;
}