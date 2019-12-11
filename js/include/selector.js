/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// selector
// script with behaviours related to selecting nodes
const Selector = Lemur.Selector = {
    
    // input
    // retourne un selector commun à utiliser pour les inputs
    input: function() 
    {
        return "input,select,textarea,button[type='submit']";
    },
    
    
    // scopedQuerySelector
    // méthode utilisé pour faire une recherche et retourner le premier enfant d'une target qui match le selector
    scopedQuerySelector: function(node,selector)
    {
        let r = null;
        Dom.checkNode(node,false);
        
        if(Debug.is('selector'))
        console.log(node,selector,'scopedQuerySelector');
        
        if(node != null)
        r = $(node).find(selector).get(0);
        
        return r;
    },
    
    
    // scopedQuerySelectorAll
    // méthode utilisé pour faire une recherche et retourner les enfants d'une target qui match le selector
    // doit retourner un array, pas une node list
    scopedQuerySelectorAll: function(node,selector)
    {
        let r = null;
        Dom.checkNode(node,false);
        
        if(Debug.is('selector'))
        console.log(node,selector,'scopedQuerySelectorAll');
        
        if(node != null)
        r = $(node).find(selector).get();
        
        return r;
    },
    
    
    // mergedQuerySelectorAll
    // permet de faire un querySelectorAll sur plusieurs nodes
    // retourne un array avec les résultats merged
    mergedQuerySelectorAll: function(nodes,selector)
    {
        let r = null;
        const $inst = this;
        Dom.checkNodes(nodes,false);
        
        if(Debug.is('selector'))
        console.log(nodes,selector,'mergedQuerySelectorAll');
        
        if(nodes != null)
        {
            r = [];
            $(nodes).each(function() {
                Arr.mergeRef(r,$inst.scopedQuerySelectorAll(this,selector));
            });
        }
        
        return r;
    }
}