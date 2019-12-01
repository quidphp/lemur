/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificPanel
// script for the panel component in the specific form page
Component.specificPanel = function()
{
    $(this).each(function(index, el) {
        
        const form = $(this);
        const panel = $(this).find("> .form-inner > .panel");
        const panelNav = $(this).find("> .form-top .left ul li a");
        const panelDescription = $(this).find("> .form-top .left .description");
        
        // panel
        Component.tabNav.call(panel,panelNav);
        Component.fragment.call(panel);
        
        panel.on('tab:init', function(event) {
            triggerCustom(this,'specificForm:bindView',[$(this)]);
        })
        .on('tab:open', function() {
            const nav = triggerFunc(this,'link:getNav');
            const description = nav.data('description') || '';
            const fragment = triggerFunc(this,'fragment:get');
            const current = Request.fragment();
            
            panelNav.removeClass('selected');
            nav.addClass('selected');
            
            if(panelDescription.length)
            panelDescription.text(description);
            
            $(this).show();
            
            if($(this).is("[data-current-panel='1']") === true && !current)
            {
                $(this).removeAttr('data-current-panel');
                triggerCustom(this,'fragment:update',[true]);
            }
            
            else if(Str.isNotEmpty(current))
            triggerCustom(this,'fragment:update');
            
            DomChange.hrefChangeHash(fragment,$("a.hashFollow"));
            form.triggerHandler('tab:getInput').val((Str.isNotEmpty(fragment))? fragment:'');
            
            $(document).trigger('document:outsideClick');
        })
        .on('tab:close', function() {
            panelNav.trigger('unselected');
            panel.hide();
        })
        .on('fragment:updated', function(event,fragment) {
            form.trigger('hash:change',[fragment]);
        });
        
        // form
        Component.hashChange.call(this);
        
        $(this).on('tab:getTarget', function() {
            return panel;
        })
        .on('tab:getInput', function(event) {
            return $(this).find("input[name='-panel-']");
        })
        .on('tab:findHash', function(event,fragment) {
            let r = panel.filter("[data-current-panel='1']");
            
            if(Str.isNotEmpty(fragment))
            r = panel.filter("[data-fragment='"+fragment+"']");
            
            if(!r.length)
            r = panel.first();
            
            return r;
        })
        .on('hash:change', function(event,fragment) {
            const target = triggerFunc(this,'tab:findHash',[fragment]);
            
            if(target.length === 1 && !triggerFunc(this,'tab:isCurrent',[target]))
            target.trigger('tab:change');
        })
        .on('tab:showFirst', function(event) {
            const target = triggerFunc(this,'tab:findHash',[Request.fragment()]);
            triggerCustom(this,'tab:changeOrFirst',[target]);
        });
        
        Component.tab.call(this,Component.tab);
        triggerCustom(this,'tab:closeAll');
        triggerCustom(this,'tab:showFirst');
    });
    
    return this;
}