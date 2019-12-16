/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// navIndex
// base component that manages index navigation for many targets
Component.NavIndex = function(option) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        target: [],
        childOpen: null,
        go: null,
        type: null
    },option);
    
    
    // check
    Str.check($option.type);
    Str.check($option.childOpen);
    Func.check($option.go);
    const type = $option.type;
    
    
    // handler
    setHdlrs(this,type+':',{
        
        getTargets: function() {
            let r = $option.target;
            
            if(Str.isNotEmpty(r))
            r = qsa(this,r);
            
            return Arr.check(r);
        },
        
        getTargetsLength: function() {
            return Arr.length(trigHdlr(this,type+':getTargets'));
        },
        
        getCurrent: function() {
            const $this = this;
            
            return Arr.find(trigHdlr(this,type+':getTargets'),function() {
                return trigHdlr(this,$option.childOpen);
            });
        },
        
        getCurrentIndex: function() {
            const current = trigHdlr(this,type+':getCurrent');
            const targets = trigHdlr(this,type+':getTargets');
            
            return Arr.search(current,targets);
        },
        
        get: function(value) {
            const current = trigHdlr(this,type+':getCurrent');
            const targets = trigHdlr(this,type+':getTargets');
            
            return Nav.indexNode(value,current,targets,$option.loop);
        },
        
        go: function(value) {
            let r = false;
            const current = trigHdlr(this,type+':getCurrent');
            const target = trigHdlr(this,type+':get',value);

            if(target != null && target != current)
            $option.go.call(this,target);
            
            return r;
        },
        
        isIndex: function(value) {
            return Nav.isIndex(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        isFirst: function() {
            return Nav.isFirst(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        hasPrev: function() {
            return Nav.hasPrev(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        hasNext: function() {
            return Nav.hasNext(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        isLast: function() {
            return Nav.isLast(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        goFirst: function() {
            trigHdlr(this,type+':go','first');
        },
        
        goPrev: function() {
            trigHdlr(this,type+':go','prev');
        },
        
        goNext: function() {
            trigHdlr(this,type+':go','next');
        },
        
        goLast: function() {
            trigHdlr(this,type+':go','last');
        }
    });
    
    return this;
}