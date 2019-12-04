/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// hashChange
// renvoie l'événement haschange aux nodes
const HashChange = function(persistent)
{
    // nodes
    const $nodes = this;
    
    
    // type
    const type = (persistent === true)? 'hashchange':'hashchange.doc-mount';
    
    
    // event
    $(window).on(type,function(event,sourceEvent) {
        event.stopPropagation();
        triggerCustom($nodes,'hash:change',Request.fragment(),sourceEvent);
    });
    
    return this;
}

// export
Component.HashChange = HashChange;