/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// modalUnload
// script containing logic for a modalUnload component
Quid.Component.modalUnload = function()
{
    // modalExternal
    // permet de gérer l'ouverture du modal lors du clique sur un lien externe
    var modalExternal = function(modal,href,route)
    {
        if(Quid.Str.isNotEmpty(href))
        {
            var filter = $(this).find("a:not(.external)").filter(function() {
                return (Quid.Uri.isExternal($(this).attr("href")) && !$(this).is("[href^='mailto:']"))? true:false;
            });
            
            filter.off('click').on('click', function(event) {
                event.preventDefault();
                var uri = $(this).attr('href');
                modal.trigger('modal:fetch',[href,{v: uri},route]);
            });
        }
        
        return this;
    }


    // modalMailto
    // permet de gérer l'ouverture du modal lors du clique sur un lien mailto
    var modalMailto = function(modal,href,route)
    {
        if(Quid.Str.isNotEmpty(href))
        {
            $(this).find("a[href^='mailto:']:not(.mailto)").off('click').on('click', function(event) {
                event.preventDefault();
                var email = Quid.email.fromHref($(this).attr('href'));
                modal.trigger('modal:fetch',[href,{v: email},route])
            });
        }
        
        return this;
    }
    
    return this;
}