/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
const Evt = new function() 
{    
    // instance
    const $inst = this;
    
    
    // debug
    // si true affiche les événements dans la console
    let debug = false;
    
    
    // debug
    // active ou désactive le débogagge
    this.debug = function(value)
    {
        if(Bool.is(value))
        debug = value;
        
        return;
    }
    
    
    // isTriggerFuncEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerFuncEqual = function(equal,type,node)
    {
        let r = false;
        const args = [type].concat(Arr.sliceStart(3,arguments));
        
        $(node).each(function(index) {
            const funcArgs = [this].concat(args);
            const result = $inst.triggerFunc.apply(null,funcArgs);
            r = (result === equal);
            
            if(r === false)
            return false;
        });
        
        return r;
    }
    
    
    // addEventListener
    // méthode qui permet d'ajouter un nouveau listener d'événement custom
    this.addEventListener = function(node,type,func,option) 
    {
        option = Object.assign({capture: false, once: false},option);
        
        if(!Str.isNotEmpty(type))
        logError('invalidType');
        
        $(node).each(function() {
            this.addEventListener(type,function(event) {
                let args = [event];
                const detail = event.detail;
                args = args.concat(detail);
                
                if(debug === true)
                console.log('listener',type,this,detail,event);
                
                func.apply(this,args);
            },option);
        });
        
        return;
    }
    
    
    // addEventListenerOnce
    // comme ael, mais le listener ne peut être déclenché qu'une seule fois
    this.addEventListenerOnce = function(node,type,func,option) 
    {
        return $inst.addEventListener(node,type,func,Object.assign({},option,{once: true}));
    }
    
    
    // trigger
    // function utilisé par triggerEvent et triggerCustom pour envoyer des événements
    this.trigger = function(node,type,custom,option)
    {
        if(!Str.isNotEmpty(type))
        logError('invalidType');
        
        const event = (custom === true)? new CustomEvent(type,option):new Event(type,option);
        
        if(debug === true)
        console.log('trigger',type,node);
        
        $(node).each(function(index, el) {
            this.dispatchEvent(event);
        });
        
        return;
    }
    
    
    // triggerEvent
    // permet de lancer des événements standards sur chaque node
    // ces événements buble
    this.triggerEvent = function(node,type) 
    {
        const data = Arr.sliceStart(2,arguments);
        const option = {bubbles: true, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,false,option);
    }
    
    
    // triggerCustom
    // permet de lancer les événements customs sur chaque node
    // ces événements ne bubble pas
    this.triggerCustom = function(node,type) 
    {
        const data = Arr.sliceStart(2,arguments);
        const option = {bubbles: false, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,true,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // ces événements ne bubble pas
    this.triggerSetup = function(node) 
    {
        const args = [node,'component:setup'].concat(Arr.sliceStart(1,arguments));
        return $inst.triggerCustom.apply(null,args);
    }
    
    
    // getFunc
    // méthode qui retourne une fonction emmagasiné dans une node
    // si plusieurs nodes, retoure la fonction de la première node
    this.getFunc = function(node,type,func) 
    {
        type = 'func:'+type;
        
        return $(node).data(type);
    }
    
    
    // setFunc
    // permet d'emmagasiné une fonction dans chaque node fournit en argument
    this.setFunc = function(node,type,func) 
    {
        type = 'func:'+type;
        $(node).data(type,func);
        
        return;
    }
    
    
    // removeFunc
    // permet de retirer une fonction emmagasiné dans une ou plusiuers node
    this.removeFunc = function(node,type) 
    {
        type = 'func:'+type;
        $(node).removeData(type);
        
        return;
    }
    
    
    // triggerFunc
    // permet de lancer la fonction sur la première node donnée en argumetn
    this.triggerFunc = function(node,type) 
    {
        let r = null;
        const one = $(node).first();
        const func = $inst.getFunc(one,type);
        const args = Arr.sliceStart(2,arguments);

        if(Func.is(func))
        {
            if(debug === true)
            console.log('triggerFunc',type,'found',node);
            
            r = func.apply(node,args);
        }
        
        else if(debug === true)
        console.log('triggerFunc',type,'notFound',node);
        
        return r;
    }
}

// export
Lemur.Evt = Evt;