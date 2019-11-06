<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// cell
// extended class to represent an existing cell within a row
class Cell extends Core\Cell
{
    // config
    public static $config = [];

    
    // complexTag
    // retourne la tag complex en lien avec la colonne
    public function complexTag(?array $attr=null):string
    {
        return $this->tag($attr,true);
    }
    
    
    // formComplex
    // génère un élément de formulaire complexe pour la cellule
    public function formComplex(?array $attr=null,?array $option=null):string
    {
        return $this->col()->formComplex($this,$attr,$option);
    }
    
    
    // formComplexWrap
    // fait un wrap à partir de formComplex plutôt que form, si existant
    public function formComplexWrap(?string $wrap=null,$pattern=null,array $attr=null,?array $replace=null,?array $option=null):string
    {
        return $this->col()->formComplexWrap($wrap,$pattern,$this,$attr,$replace,$option);
    }
    
    
    // getDataAttr
    // retourne les dates attr pour la cellule
    public function getDataAttr(array $return):array
    {
        return $this->col()->getDataAttr($return);
    }
}

// init
Cell::__init();
?>