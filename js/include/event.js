/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// event
// script containing event management functions
Quid.Event = new function() 
{    
    // instance
    var $inst = this;
    
    
    // debug
    // si true affiche les événements dans la console
    var debug = false;
    
    
    // debug
    // active ou désactive le débogagge
    this.debug = function(value)
    {
        if(Quid.Bool.is(value))
        debug = value;
        
        return;
    }
    
    
    // isTriggerFuncEqual
    // retourne vrai si la fonction de chaque node retourne la valeur donné en argument
    this.isTriggerFuncEqual = function(equal,type,node)
    {
        var r = false;
        var args = [type].concat(Quid.Arr.sliceStart(3,arguments));
        
        $(node).each(function(index) {
            var funcArgs = [this].concat(args);
            var result = $inst.triggerFunc.apply(null,funcArgs);
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
        
        $(node).each(function() {
            this.addEventListener(type,function(event) {
                var args = [event];
                var detail = event.detail;
                args = args.concat(detail);
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
        var event = (custom === true)? new CustomEvent(type,option):new Event(type,option);
        
        if(debug === true)
        console.log(node,event);
        
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
        var data = Quid.Arr.sliceStart(2,arguments);
        var option = {bubbles: true, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,false,option);
    }
    
    
    // triggerCustom
    // permet de lancer les événements customs sur chaque node
    // ces événements ne bubble pas
    this.triggerCustom = function(node,type) 
    {
        var data = Quid.Arr.sliceStart(2,arguments);
        var option = {bubbles: false, cancelable: true, detail: data};
        
        return $inst.trigger(node,type,true,option);
    }
    
    
    // triggerSetup
    // fonction utilisé pour lancer le setup sur un component
    // ces événements ne bubble pas
    this.triggerSetup = function(node) 
    {
        var args = [node,'component:setup'].concat(Quid.Arr.sliceStart(1,arguments));
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
        var r = null;
        var one = $(node).first();
        var func = $inst.getFunc(one,type);
        var args = Quid.Arr.sliceStart(2,arguments);

        if(Quid.Func.is(func))
        {
            if(debug === true)
            console.log(node,type);
            
            r = func.apply(node,args);
        }
        
        return r;
    }
}