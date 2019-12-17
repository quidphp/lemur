/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificComponents
// component that manages the panel on the specific form page of the CMS
Component.SpecificComponents = function(option)
{
    // une node
    Dom.checkNode(this,document);
    
    
    // option components
    const $components = Pojo.replaceRecursive({
        date: {
            match: "[data-group='date']",
            component: Component.CalendarInput,
            setupOnView: true
        },
        
        checkboxSortable: {
            match: "[data-tag='checkbox'][data-sortable='1']",
            component: Component.Sorter,
            option: {items: ".choice", handle: '.choice-in'},
            setupOnView: true
        },
        
        enumSet: {
            match: "[data-tag='search']",
            component: Component.EnumSet,
            setupOnView: true
        },
        
        files: {
            match: "[data-group='media']",
            component: Component.InputFiles,
            setupOnView: true
        },
        
        addRemove: {
            match: "[data-tag='add-remove']",
            component: Component.AddRemove,
            setupOnView: true
        },
        
        textareaExtra: {
            match: "[data-tag='textarea']",
            component: Component.TextareaExtra,
            setupOnView: true
        }
    },option);
    
    
    // handler
    setHdlrs(this,'specificComponents:',{
        
        get: function() {
            return $components;
        },
        
        match: function(node) {
            let r = undefined;
            Dom.checkNode(node);
            
            Pojo.each($components,function() {
                if($(node).is(this.match))
                {
                    r = this;
                    return false;
                }
            });
            
            return r;
        },
        
        setup: function(nodes,view) {
            Dom.checkNodes(nodes,false);
            
            Dom.each(nodes,function() {
                const $this = this;
                const comp = trigHdlr(document,'specificComponents:match',this);
                const node = qs(this,'.specific-component');
                let found = false;
                Dom.checkNode(node);
                
                if(comp != null && comp.setupOnView == view)
                {
                    found = true;
                    comp.component.call(node,comp.option);
                    trigSetup(node);
                }
                
                if(found === false && view === false)
                Component.Base.call(node);
            });
        },
        
        teardown: function(nodes) {
            nodesCall(nodes,'component:teardown');
        },
        
        enable: function(nodes) {
            nodesCall(nodes,'component:enable');
        },
        
        disable: function(nodes) {
            nodesCall(nodes,'component:disable');
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigEvt(this,'specificComponents:update',$components);
    });
    
    
    // nodesCall
    function nodesCall(nodes,type)
    {
        const specComp = mergedQsa(nodes,'.specific-component');
        trigEvt(specComp,type);
    }
    
    return this;
}