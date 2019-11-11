<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;
use Quid\Base;
use Quid\Base\Html;

// cell
// extended class to represent an existing cell within a row
class Cell extends Core\Cell
{
    // config
    public static $config = [];

    
    // generalComponent
    // génère le html pour le general component de la cellule
    // utilisé dans le tableau général de lemur
    final public function generalComponent($attr=null,?array $option=null):string
    {
        $return = '';
        $option = Base\Arr::plus(array('specific'=>null,'context'=>'cms:general'),$option);
        $value = $this->get($option);
        $col = $this->col();
        $placeholder = $col->emptyPlaceholder($value);
        
        if(is_string($placeholder))
        $value = Html::div($placeholder,'empty-placeholder');

        $return = Html::div($value,$attr,$option);
        
        return $return;
    }
    
    
    // specificComponent
    // génère le html pour le specific component de la cellule
    // utilisé dans les formulaires spécifiques de lemur
    final public function specificComponent(string $wrap,$pattern=null,array $attr=null,?array $replace=null,?array $option=null):string
    {
        $return = '';
        $option = Base\Arr::plus(array('context'=>'cms:specific'),$option);
        $return = $this->formComplexWrap($wrap,$pattern,$attr,$replace,$option);
        
        return $return;
    }
    
    
    // complexTag
    // retourne la tag complex en lien avec la colonne
    final public function complexTag(?array $attr=null):string
    {
        return $this->tag($attr,true);
    }


    // formComplex
    // génère un élément de formulaire complexe pour la cellule
    final public function formComplex(?array $attr=null,?array $option=null):string
    {
        return $this->col()->formComplex($this,$attr,$option);
    }


    // formComplexWrap
    // fait un wrap à partir de formComplex plutôt que form, si existant
    final public function formComplexWrap(?string $wrap=null,$pattern=null,array $attr=null,?array $replace=null,?array $option=null):string
    {
        return $this->col()->formComplexWrap($wrap,$pattern,$this,$attr,$replace,$option);
    }


    // getDataAttr
    // retourne les dates attr pour la cellule
    final public function getDataAttr(array $return):array
    {
        return $this->col()->getDataAttr($return);
    }
}

// init
Cell::__init();
?>