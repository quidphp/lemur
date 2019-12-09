/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// selector
// script with behaviours related to selecting nodes
const Selector = new function() 
{
    // input
    // retourne un selector commun à utiliser pour les inputs
    this.input = function() 
    {
        return "input,select,textarea,button[type='submit']";
    }
    
    
    // scopedQuerySelector
    // méthode utilisé pour faire une recherche et retourner le premier enfant d'une target qui match le selector
    this.scopedQuerySelector = function(node,selector)
    {
        return $(node).first().find(selector).get(0);
    }
    
    
    // scopedQuerySelectorAll
    // méthode utilisé pour faire une recherche et retourner les enfants d'une target qui match le selector
    // doit retourner un array, pas une node list
    this.scopedQuerySelectorAll = function(node,selector)
    {
        return $(node).first().find(selector).get();
    }
}

// export
Lemur.Selector = Selector;