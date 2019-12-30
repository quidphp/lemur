/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// eleHelper
// script with custom functions related to element nodes
const EleHelper = Lemur.EleHelper = {
    
    // getUri
    // retourne l'uri à partir d'une node
    getUri: function(node)
    {
        let r = undefined;
        const tag = Ele.tag(node);
        
        if(tag === 'form')
        r = Ele.getAttr(node,"action");
        
        else
        r = Ele.getAttr(node,"href") || Ele.getAttr(node,'data-href');
        
        return r;
    },
    
    
    // serialize
    // permet de serializer une ou plusieurs nodes
    serialize: function(nodes)
    {
        nodes = Nod.wrap(nodes,true);
        
        return $(nodes).serialize();
    },
    
    
    // valueSeparator
    // prend un ensemble de input et crée un set avec les valeurs
    // un séparateur peut être fourni, sinon utilise -
    valueSeparator: function(nodes,separator,trim) 
    {
        let r = '';
        separator = (Str.isNotEmpty(separator))? separator:'-';
        
        if(Str.isNotEmpty(separator))
        {
            Ele.each(nodes,function() {
                r += (r.length)? separator:"";
                r += Ele.getValue(this,trim);
            });
        }
        
        return r;
    },
    
    
    // dataHrefReplaceChar
    // permet de changer le caractère de remplacement sur une balise avec attribut data-href
    dataHrefReplaceChar: function(node,replace,replace2) 
    {
        let r = null;
        Ele.check(node);
        
        if(Num.is(replace))
        replace = Str.cast(replace);
        
        if(Num.is(replace2))
        replace2 = Str.cast(replace2);
        
        if(node != null && Str.isNotEmpty(replace))
        {
            const href = Ele.getAttr(node,'data-href');
            const char = Ele.getAttr(node,'data-char');
            
            if(Str.isNotEmpty(href) && Str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(Str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
        }
        
        return r;
    }
}