/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificPanel
// script for the panel component in the specific form page
Quid.Component.specificPanel = function()
{
    $(this).each(function(index, el) {
        
        var form = $(this);
        var panel = $(this).find("> .form-inner > .panel");
        var panelNav = $(this).find("> .form-top .left ul li a");
        var panelDescription = $(this).find("> .form-top .left .description");
        
        // panel
        Quid.Component.tabNav.call(panel,panelNav);
        Quid.Component.fragment.call(panel);
        
        panel.on('tab:init', function(event) {
            $(this).trigger('specificForm:bindView',[$(this)]);
        })
        .on('tab:open', function() {
            var nav = $(this).triggerHandler('link:getNav');
            var description = nav.data('description') || '';
            var fragment = $(this).triggerHandler('fragment:get');
            var current = Quid.Request.fragment();
            
            panelNav.removeClass('selected');
            nav.addClass('selected');
            
            if(panelDescription.length)
            panelDescription.text(description);
            
            $(this).show();
            
            if($(this).is("[data-current-panel='1']") === true && !current)
            {
                $(this).removeAttr('data-current-panel');
                $(this).trigger('fragment:update',[true]);
            }
            
            else if(Quid.Str.isNotEmpty(current))
            $(this).trigger('fragment:update');
            
            Quid.Dom.hrefChangeHash(fragment,$("a.hashFollow"));
            form.triggerHandler('tab:getInput').val((Quid.Str.isNotEmpty(fragment))? fragment:'');
            
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
        Quid.Component.hashChange.call(this);
        
        $(this).on('tab:getTarget', function() {
            return panel;
        })
        .on('tab:getInput', function(event) {
            return $(this).find("input[name='-panel-']");
        })
        .on('tab:findHash', function(event,fragment) {
            var r = panel.filter("[data-current-panel='1']");
            
            if(Quid.Str.isNotEmpty(fragment))
            r = panel.filter("[data-fragment='"+fragment+"']");
            
            if(!r.length)
            r = panel.first();
            
            return r;
        })
        .on('hash:change', function(event,fragment) {
            var target = $(this).triggerHandler('tab:findHash',[fragment]);
            
            if(target.length === 1 && !$(this).triggerHandler('tab:isCurrent',[target]))
            target.trigger('tab:change');
        })
        .on('tab:showFirst', function(event) {
            var target = $(this).triggerHandler('tab:findHash',[Quid.Request.fragment()]);
            $(this).trigger('tab:changeOrFirst',[target]);
        });
        
        Quid.Component.tab.call(this,Quid.Component.tab);
        $(this).trigger('tab:closeAll');
        $(this).trigger('tab:showFirst');
    });
    
    return this;
}