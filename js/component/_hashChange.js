/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
 // hashChange
 // renvoie l'événement haschange aux nodes
Component.hashChange = function(persistent)
{
    const $this = $(this);
    const type = (persistent === true)? 'hashchange':'hashchange.document-mount';
    $(window).on(type,function(event,sourceEvent) {
        event.stopPropagation();
        $this.trigger('hash:change',[Request.fragment(),sourceEvent]);
    });
    
    return this;
}