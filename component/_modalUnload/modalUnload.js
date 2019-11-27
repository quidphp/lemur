// modalExternal
// permet de gérer l'ouverture du modal lors du clique sur un lien externe
quid.component.modalExternal = function(modal,href,route)
{
    if(quid.base.str.isNotEmpty(href))
    {
        $(this).find("a:external:not(.external)").off('click').on('click', function(event) {
            event.preventDefault();
            var uri = $(this).attr('href');
            modal.trigger('modal:fetch',[href,{v: uri},route]);
        });
    }
    
    return this;
}


// modalMailto
// permet de gérer l'ouverture du modal lors du clique sur un lien mailto
quid.component.modalMailto = function(modal,href,route)
{
    if(quid.base.str.isNotEmpty(href))
    {
        $(this).find("a[href^='mailto:']:not(.mailto)").off('click').on('click', function(event) {
            event.preventDefault();
            var email = quid.base.email.fromHref($(this).attr('href'));
            modal.trigger('modal:fetch',[href,{v: email},route])
        });
    }
    
    return this;
}