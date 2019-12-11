/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// react
// script containing logic for mounting and unmounting react components
Component.react = function()
{
    // bindDocument
    // applique les bindings pour react à la node document
    const bindDocument = function() 
    {
        $that.bind.call(this);
        
        $(this).on('doc:mount',function(event) {
            trigEvt(this,'reactContainer:mount');
        })
        .on('doc:unmount',function(event) {
            trigEvt(this,'reactContainer:unmount');
        });
        
        return this;
    }
    
    
    // createReactElement
    const createReactElement = function(props)
    {
        let r = null;
        const component = $(this).attr('data-component');
        const namespace = $(this).attr('data-namespace');
        const content = $(this).attr('data-content');
        const path = (namespace+"."+component).split('.');
        const callable = Pojo.climb(path,window);
        props = props || Json.decode($(this).attr('data-props'));
        props.parentNode = this;
        
        r = React.createElement(callable,props,content);
        
        return r;
    }
    
    // renderReactComponent
    const renderReactComponent = function(props)
    {
        const node = $(this)[0];
        const component = createReactElement.call(this,props);
        
        if(component != null)
        ReactDOM.render(component,node);
        
        return;
    }
    
    // unmountReactComponent
    const unmountReactComponent = function()
    {
        ReactDOM.unmountComponentAtNode($(this)[0]);
        
        return;
    }
    
    $(this).on('reactContainer:mount',function(event,uri) {
        const components = trigHandler(this,'reactContainer:getComponents');
        
        components.on('react:mount',function(event) {
            renderReactComponent.call(this);
        })
        .on('react:unmount',function(event) {
            unmountReactComponent.call(this);
        })
        .on('react:updateProps',function(event,props) {
            const initialProps = Json.decode($(this).attr('data-props'));
            props = Pojo.replace(initialProps,props);
            renderReactComponent.call(this,props);
        })
        .on('react:replaceProps',function(event,props) {
            renderReactComponent.call(this,props);
        })
        .trigger('react:mount');
    })
    .on('reactContainer:unmount',function(event) {
        const components = trigHandler(this,'reactContainer:getComponents');
        components.trigger('react:unmount');
    })
    .on('reactContainer:getComponents',function(event) {
        return $(this).find(".react-component");
    });
    
    return this;
}