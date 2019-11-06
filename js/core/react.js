"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */


// react
// script containing logic for mounting and unmounting react components
if(typeof(ReactDOM) !== 'undefined')
{
    // objet globale par défaut pour conserver les components react
    quid.react = {};
    
    // react
    // permet monter et démonter les components reacts
    quid.core.react = $.fn.react = function()
    {
        // createReactElement
        function createReactElement(props)
        {
            var r = null;
            var component = $(this).attr('data-component');
            var namespace = $(this).attr('data-namespace');
            var content = $(this).attr('data-content');
            var path = (namespace+"."+component).split('.');
            var callable = quid.base.objClimb(path,window);
            props = props || JSON.parse($(this).attr('data-props'));
            props.parentNode = this;
            
            r = React.createElement(callable,props,content);
            
            return r;
        }
        
        // renderReactComponent
        function renderReactComponent(props)
        {
            var node = $(this)[0];
            var component = createReactElement.call(this,props);
            
            if(component != null)
            ReactDOM.render(component,node);
            
            return;
        }
        
        // unmountReactComponent
        function unmountReactComponent()
        {
            ReactDOM.unmountComponentAtNode($(this)[0]);
            
            return;
        }
        
        $(this).on('document:mount', function(event,uri) {
            var components = $(this).triggerHandler('document:getReactComponents');
            
            components.on('react:mount', function(event) {
                renderReactComponent.call(this);
            })
            .on('react:unmount', function(event) {
                unmountReactComponent.call(this);
            })
            .on('react:updateProps', function(event,props) {
                var initialProps = JSON.parse($(this).attr('data-props'));
                props = $.extend(initialProps,props);
                renderReactComponent.call(this,props);
            })
            .on('react:replaceProps', function(event,props) {
                renderReactComponent.call(this,props);
            })
            .trigger('react:mount');
        })
        .on('document:unmount', function(event) {
            var components = $(this).triggerHandler('document:getReactComponents');
            components.trigger('react:unmount');
        })
        .on('document:getReactComponents', function(event) {
            return $(this).find(".react-component");
        });
        
        return this;
    }
}