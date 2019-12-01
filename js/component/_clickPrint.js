/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// confirm
// sur clique de l'élément, imprime la page
Component.clickPrint = function() 
{
    $(this).on('click', function(event) {
        window.print();
    });
    
    return this;
}