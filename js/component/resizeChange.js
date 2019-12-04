/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// resizeChange
// component to notify nodes when window size has changed
const ResizeChange = function(persistent)
{
    // nodes
    const $nodes = this;
    
    
    // type
    const type = (persistent === true)? 'resize':'resize.doc-mount';
    
    
    // event
    $(window).on(type,function(event) {
        event.stopPropagation();
        triggerCustom($nodes,'resize:change');
    });
    
    return this;
}

// export
Component.ResizeChange = ResizeChange;