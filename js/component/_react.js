/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// react
// script containing logic for mounting and unmounting react components
quid.component.react = function()
{
    // bindDocument
    // applique les bindings pour react à la node document
    var bindDocument = function() 
    {
        $that.bind.call(this);
        
        $(this).on('document:mount', function(event) {
            $(this).trigger('reactContainer:mount');
        })
        .on('document:unmount', function(event) {
            $(this).trigger('reactContainer:unmount');
        });
        
        return this;
    }
    
    
    // createReactElement
    var createReactElement = function(props)
    {
        var r = null;
        var component = $(this).attr('data-component');
        var namespace = $(this).attr('data-namespace');
        var content = $(this).attr('data-content');
        var path = (namespace+"."+component).split('.');
        var callable = quid.obj.climb(path,window);
        props = props || quid.json.decode($(this).attr('data-props'));
        props.parentNode = this;
        
        r = React.createElement(callable,props,content);
        
        return r;
    }
    
    // renderReactComponent
    var renderReactComponent = function(props)
    {
        var node = $(this)[0];
        var component = createReactElement.call(this,props);
        
        if(component != null)
        ReactDOM.render(component,node);
        
        return;
    }
    
    // unmountReactComponent
    var unmountReactComponent = function()
    {
        ReactDOM.unmountComponentAtNode($(this)[0]);
        
        return;
    }
    
    $(this).on('reactContainer:mount', function(event,uri) {
        var components = $(this).triggerHandler('reactContainer:getComponents');
        
        components.on('react:mount', function(event) {
            renderReactComponent.call(this);
        })
        .on('react:unmount', function(event) {
            unmountReactComponent.call(this);
        })
        .on('react:updateProps', function(event,props) {
            var initialProps = quid.json.decode($(this).attr('data-props'));
            props = quid.obj.replace(initialProps,props);
            renderReactComponent.call(this,props);
        })
        .on('react:replaceProps', function(event,props) {
            renderReactComponent.call(this,props);
        })
        .trigger('react:mount');
    })
    .on('reactContainer:unmount', function(event) {
        var components = $(this).triggerHandler('reactContainer:getComponents');
        components.trigger('react:unmount');
    })
    .on('reactContainer:getComponents', function(event) {
        return $(this).find(".react-component");
    });
    
    return this;
}