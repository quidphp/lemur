/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// generalComponents
// component that manages the components on the general page
Component.GeneralComponents = function()
{
    // une node
    Vari.check(this,document);
    
    
    // components
    const $components = [];
    
    
    // handler
    setHdlrs(this,'generalComponents:',{
        
        match: function(node) {
            return Arr.find($components,function(ele) {
                return Ele.match(node,ele.match);
            });
        },
        
        teardown: function(nodes) {
            const genComp = Ele.mergedQsa(nodes,'.general-component');
            trigEvt(genComp,'component:teardown');
        },
        
        setup: function(nodes,view) {
            Arr.each(nodes,function(ele) {
                const comp = trigHdlr(document,'generalComponents:match',ele);
                const node = qs(ele,'.general-component',true);
                
                if(comp != null)
                {
                    comp.component.call(node,comp.option);
                    trigSetup(node);
                }
            });
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigEvt(this,'generalComponents:update',$components);
        Arr.reverseRef($components);
    });
    
    return this;
}