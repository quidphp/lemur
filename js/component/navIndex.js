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
    const $option = Pojo.replace({
        type: null,
        child: null,
        childActive: null,
        target: [],
        go: null,
        loop: false,
        attr: null
    },option);
    
    
    // check
    Str.check($option.type);
    Str.check($option.child);
    Str.check($option.childActive);
    const type = $option.type;
    const child = $option.child;
    
    
    // defaultChange
    const defaultChange = function(target,context)
    {
        let r = false;
        const $this = this;
        const targets = trigHdlr(this,type+':getTargets');
        const current = trigHdlr(this,type+':getCurrent');
        
        if(trigHdlr(target,child+':canOpen') && (current == null || trigHdlr(current,child+':canClose')))
        {
            r = true;
            trigEvt(this,type+':beforeChange',target,current,context,targets);
            
            Arr.each(targets,function() {
                if(this !== target)
                trigEvt(this,child+':close',context);
            }); 
            
            const promise = trigHdlr(this,type+':getPromise',target,current,context,targets);
            const callback = function() {
                trigEvt(target,child+':open');
                trigEvt($this,type+':afterChange',target,current,context,targets);
            };
            
            if(promise != null)
            promise.then(callback);
            
            else
            callback();
        }
        
        return r;
    }
    
    
    // go true
    if($option.go == null)
    $option.go = defaultChange;
    Func.check($option.go);
    
    
    // handler
    setHdlrs(this,type+':',{
        
        canChange: function() {
            return true;
        },
        
        getTargets: function() {
            let r = $option.target;
            
            if(Str.isNotEmpty(r))
            r = qsa(this,r);
            
            Arr.check(r);
            trigEvt(this,type+':bindChilds',r);
            
            return r;
        },

        getTargetsLength: function() {
            return Arr.length(trigHdlr(this,type+':getTargets'));
        },
        
        getCurrent: function() {
            const targets = trigHdlr(this,type+':getTargets');
            return Arr.find(targets,function() {
                return trigHdlr(this,child+':'+$option.childActive);
            });
        },
        
        getCurrentIndex: function() {
            const current = trigHdlr(this,type+':getCurrent');
            const targets = trigHdlr(this,type+':getTargets');
            
            return Arr.search(current,targets);
        },
        
        get: function(value) {
            value = trigHdlr(this,type+':readyValue',value);
            const current = trigHdlr(this,type+':getCurrent');
            const targets = trigHdlr(this,type+':getTargets');
            
            return Nav.indexNode(value,current,targets,$option.loop);
        },
        
        go: function(value,context) {
            let r = false;
            
            if(trigHdlr(this,type+':canChange') === true)
            {
                const target = trigHdlr(this,type+':get',value);
                const current = trigHdlr(this,type+':getCurrent');
                
                if(target != null && target != current)
                r = $option.go.call(this,target,context);
            }
            
            return r;
        },
        
        isIndex: function(value) {
            return Nav.isIndex(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        isFirst: function() {
            return Nav.isFirst(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        hasPrev: function() {
            return Nav.hasPrev(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'),$option.loop);
        },
        
        hasNext: function() {
            return Nav.hasNext(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'),$option.loop);
        },
        
        isLast: function() {
            return Nav.isLast(trigHdlr(this,type+':getCurrentIndex'),trigHdlr(this,type+':getTargetsLength'));
        },
        
        goFirst: function(context) {
            return trigHdlr(this,type+':go','first',context);
        },
        
        goPrev: function(context) {
            return trigHdlr(this,type+':go','prev',context);
        },
        
        goNext: function(context) {
            return trigHdlr(this,type+':go','next',context);
        },
        
        goLast: function(context) {
            return trigHdlr(this,type+':go','last',context);
        },
        
        readyValue: function(value) {
            return (value == null)? 'first':value;
        },
    });
    
    
    // event
    ael(this,type+':bindChilds',function(event,value) {
        bindChilds.call(this,value);
    });
    
    // setup
    aelOnce(this,'component:ready',function(event,value) {
        trigHdlr(this,type+':go',value,'ready');
    });
    
    
    // bindChilds
    const bindChilds = function(value)
    {
        const $this = this;
        
        const handlers = {
            isEmpty: function() {
                return Nod.match(this,":empty");
            },
            
            getParent: function() {
                return $this;
            }
        };
        
        Arr.each(value,function() {
            if(!trigHdlr(this,child+':isBinded'))
            {
                // components
                Component.InitOpenClose.call(this,Pojo.replace($option,{type: child}));
                
                // handler
                setHdlrs(this,child+':',handlers);
            }
        });
    }
    
    return this;
}