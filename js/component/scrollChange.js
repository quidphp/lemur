/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// component to notify nodes when window scroll has changed
const ScrollChange = function(persistent)
{
    // nodes
    const $nodes = this;
    
    
    // type
    const type = (persistent === true)? 'scroll':'scroll.doc-mount';
    
    
    // event
    $(window).on(type,function(event) {
        event.stopPropagation();
        triggerCustom($nodes,'scroll:change');
    });
    
    return this;
}

// export
Component.ScrollChange = ScrollChange;