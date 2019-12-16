/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
const Evt = Lemur.Evt = new function()
{    
    // inst
    const $inst = this;
    
    
    // preventStop
    // permet de faire un prevent default et stop propagation à un événement
    this.preventStop = function(event,immediate)
    {
        event.preventDefault();
        
        if(immediate === true)
        event.stopImmediatePropagation();
        
        else
        event.stopPropagation();
        
        return false;
    }
    
    
    // nameFromType
    // retourne event ou custom event selon le type
    // un nom de type avec un . ou : est custom
    this.nameFromType = function(type)
    {
        let r = null;
        
        if(Str.isNotEmpty(type) && type.length)
        {
            r = 'event';
            
            if(Str.in('.',type) || Str.in(':',type))
            r = 'customEvent';
        }
        
        return r;
    }
    
    
    // createFromType
    // crée l'objet event à partir d'un type
    this.createFromType = function(type,option)
    {
        let r = null;
        const name = this.nameFromType(type);
        
        if(name != null)
        {
            if(name === 'customEvent')
            r = new CustomEvent(type,option);
            
            else if(name === 'event')
            r = new Event(type,option);
        }
        
        return r;
    }
    
    
    // getTriggerTarget
    // retourne la trigger target, en lien avec les bindings delegate
    // créés la propirété triggerTarget sur l'objet event
    this.getTriggerTarget = function(event)
    {
        let r = null;
        
        if(Obj.is(event) && event.target)
        {
            if(event.triggerTarget != null)
            r = event.triggerTarget;
            
            else
            r = event.target;
        }
        
        return r;
    }
    
    
    // addEventListener
    // méthode qui permet d'ajouter un nouveau listener d'événement
    // retourne un tableau avec les paramètres pour retirer le listener
    this.addEventListener = function(nodes,type,func,register,delegate,option) 
    {
        let r = null;
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            option = Object.assign({capture: false, once: false},option);
            
            const handler = addEventListenerHandler(type,func,delegate);
            
            Arr.each(nodes,function() {
                this.addEventListener(type,handler,option);
                
                if(Str.isNotEmpty(register))
                $inst.registerEventListener(this,register,type,handler,option);
            });
            
            r = [type,handler,option];
        }
        
        return r;
    }
    
    
    // addEventListenerHandler
    // retourne le handler utilisé par addEventListener
    const addEventListenerHandler = function(type,func,delegate) 
    {
        return function(event) {
            let go = (delegate == null)? true:false;
            let context = this;
            
            if(Str.isNotEmpty(delegate) && event.target != null)
            {
                go = prepareEventDelegate.call(this,event,delegate);
                context = event.triggerTarget;
            }
            
            if(go === true)
            {
                let args = [event];
                const detail = event.detail;
                args = Arr.merge(args,detail);
                
                if(Debug.is('evt'))
                console.log('listener',this,type,event,delegate,detail);
                
                func.apply(context,args);
            }
        };
    }
    
    
    // prepareEventDelegate
    // handlertion protégé
    // gère la délégation et le changement à l'objet event
    const prepareEventDelegate = function(event,delegate)
    {
        let r = false;
        const context = event.target;
        const nodes = Selector.scopedQueryAll(this,delegate);
        const delegateTarget = this;
        let triggerTarget = context;
        
        if($(nodes).filter(context).length)
        r = true;
        
        else
        {
            let query;
            
            Arr.each(nodes,function(node) {
                if(node.contains(context))
                {
                    triggerTarget = $(context).parents(delegate).get(0);
                    r = true;
                    return false;
                }
            });
        }
        
        event.delegateTarget = delegateTarget;
        event.triggerTarget = triggerTarget;
        
        return r;
    }
    
    
    // registerEventListener
    // permet d'enregistrer un event listener dans la node
    // ceci permet de le retirer par la suite
    this.registerEventListener = function(node,register,type,handler,option) 
    {
        const data = Dom.getOrSetData(node,'rel',{});
        const entry = [type,handler,option];
        Pojo.setRef(register,entry,data);
        
        return;
    }
    
    
    // addEventListenerOnce
    // comme ael, mais le listener ne peut être déclenché qu'une seule fois
    this.addEventListenerOnce = function(node,type,func,register,delegate,option) 
    {
        return this.addEventListener(node,type,func,register,delegate,Object.assign({},option,{once: true}));
    }
    
    
    // addDelegatedEventListener
    // permet d'ajouter un event listener qui se trigge seulement selon le delegate
    this.addDelegatedEventListener = function(node,type,delegate,func,register,option)
    {
        return this.addEventListener(node,type,func,register,delegate,option);
    }
    
    
    // removeEventListener
    // permet de retirer un event listener
    // args est le tableau retournée par addEventListener (contient type, handler et option)
    this.removeEventListener = function(nodes,args)
    {
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,'removeEventListener');
        
        if(Arr.isNotEmpty(nodes))
        {
            if(Debug.is('evt'))
            {
                let consoleArgs = ['removeListener',nodes,Arr.copy(args).shift()];
                console.log.apply(this,consoleArgs);
            }
            
            Arr.each(nodes,function() {
                if(Str.isNotEmpty(args))
                {
                    const key = args;
                    const data = Dom.getData(this,'rel');
                    args = Pojo.get(key,data);
                    Pojo.unsetRef(key,data);
                }
                
                if(Arr.is(args))
                this.removeEventListener.apply(this,args);
            });
        }
        
        return;
    }
    

    // trigger
    // handlertion utilisé par triggerEvent et triggerBubble pour envoyer des événements
    this.trigger = function(nodes,type,option)
    {
        Str.check(type,true);
        nodes = Dom.nodeWrap(nodes);
        Dom.checkNodes(nodes,false,type);
        
        if(Arr.isNotEmpty(nodes))
        {
            const event = this.createFromType(type,option);
            
            if(Debug.is('evt'))
            console.log('trigger',type,nodes);
            
            Arr.each(nodes,function() {
                this.dispatchEvent(event);
            });
        }
        
        return;
    }
    
    
    // triggerEvent
    // permet de lancer des événements sur chaque node
    // ces événements ne bubble pas
    this.triggerEvent = function(nodes,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: false, cancelable: true, detail: data};
        
        return this.trigger(nodes,type,option);
    }
    
    
    // triggerBubble
    // permet de lancer des événements sur chaque node
    // ces événements bubble
    this.triggerBubble = function(nodes,type) 
    {
        const data = ArrLike.sliceStart(2,arguments);
        const option = {bubbles: true, cancelable: true, detail: data};
        
        return this.trigger(nodes,type,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // ces événements ne bubble pas
    this.triggerSetup = function(nodes) 
    {
        const args = Arr.merge([nodes,'component:setup'],ArrLike.sliceStart(1,arguments));
        return this.triggerEvent.apply(this,args);
    }
    
    
    // triggerTeardown
    // fonction utilisé pour lancer le démontange d'un component
    // ces événements ne bubble pas
    this.triggerTeardown = function(nodes) 
    {
        const args = Arr.merge([nodes,'component:teardown'],ArrLike.sliceStart(1,arguments));
        return this.triggerEvent.apply(this,args);
    }
};