/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// modalMailto
// script containing for mailto links opening in a modal for confirmation
Component.ModalMailto = function(option)
{
    // option
    const $option = Pojo.replace({
        query: 'v',
        href: null,
        route: 'email'
    },option);
    
    
    // handler
    setHdlrs(this,'modalMailto:',{
        
        getModal: function() {
            return trigHdlr(document,'doc:getModal');
        },
        
        getAnchors: function() {
            return qsa(this,"a[href^='mailto:']:not([data-mailto='1'])");
        },
        
        getHref: function() {
            const modal = trigHdlr(this,'modalMailto:getModal');
            const href = getAttr(modal,'data-mailto') || $option.href;
            return Str.check(href,true);
        },
        
        getQuery: function() {
            return Str.check($option.query,true);
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindAnchors.call(this);
    });
    
    
    // bindAnchors
    const bindAnchors = function()
    {
        const modal = trigHdlr(this,'modalMailto:getModal');
        const anchors = trigHdlr(this,'modalMailto:getAnchors');
        const href = trigHdlr(this,'modalMailto:getHref');
        const query = trigHdlr(this,'modalMailto:getQuery');
        
        ael(anchors,'click',function(event) {
            const anchorHref = getAttr(this,'href');
            const mailto = Uri.getMailto(anchorHref);
            
            if(Str.isNotEmpty(mailto))
            {
                const config = {};
                config.url = href;
                config.data = {};
                config.data[query] = mailto;
                trigHdlr(modal,'modal:fetch',config,$option.route);
                Evt.preventStop(event,true);
            }
        });
    }
    
    return this;
}