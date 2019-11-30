/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabNav
// script with behaviours for a tab component with nav
quid.component.tabNav = function(navs)
{
    if(navs instanceof jQuery && navs.length === $(this).length)
    {
        var targets = $(this);
        
        $(this).each(function(index) 
        {
            var nav = navs.eq(index);
            
            if(nav.length)
            {
                $(this).data('link-nav',nav).on('link:getIndex', function() {
                    return targets.index($(this));
                })
                .on('link:getNav', function() {
                    return $(this).data('link-nav');
                });
                
                nav.data('link-target',$(this)).on('link:getIndex', function() {
                    return navs.index($(this));
                })
                .on('link:getTarget', function() {
                    return $(this).data('link-target');
                });
            }
        });
    }
    
    return this;
}