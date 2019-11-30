/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
 // hashChange
 // renvoie l'événement haschange aux nodes
quid.component.hashChange = function(persistent)
{
    var $this = $(this);
    var type = (persistent === true)? 'hashchange':'hashchange.document-mount';
    $(window).on(type, function(event,sourceEvent) {
        event.stopPropagation();
        $this.trigger('hash:change',[quid.request.fragment(),sourceEvent]);
    });
    
    return this;
}