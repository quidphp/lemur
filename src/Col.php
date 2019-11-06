<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Base;
use Quid\Core;

// col
// extended class to represent an existing column within a table, adds cms config
class Col extends Core\Col
{
    // config
    public static $config = [
        'onComplex'=>null, // callable pour onComplex, si true alors utilise la méthode onGet lors de la création des éléments de formulaires complexes
        '@cms'=>[
            'filter'=>true,
            'filterEmptyNotEmpty'=>true,
            'relationExport'=>null, // si la colonne doit être incluses comme exporation de relation (par exemple user s'exporte en plusieurs champs dans le CSV)
            'generalExcerptMin'=>100]
    ];


    // onComplex
    // permet de formater une valeur simple vers un type plus complexe
    // utilisé lors de la génération d'un élément de formulaire, si onComplex est true renvoie à onGet
    public function onComplex($return,array $option)
    {
        $onComplex = $this->getAttr('onComplex');

        if($onComplex === true)
        $return = $this->onGet($return,$option);

        else
        $return = $this->attrCallback('onComplex',true,$return,$option);

        return $return;
    }


    // valueComplex
    // génère une valeur en vue de l'affichage dans un élément de formulaire complexe
    public function valueComplex($return=true,?array $option=null)
    {
        $option = (array) $option;

        if($return instanceof Cell)
        $option['cell'] = $return;

        $return = $this->value($return);
        $return = $this->onComplex($return,$option);

        return $return;
    }


    // complexTag
    // retourne la tag complex en lien avec la colonne
    public function complexTag(?array $attr=null):string
    {
        return $this->tag($attr,true);
    }


    // formComplexAttr
    // retourne les attributs de formulaires complexes avec un tableau d'attributs en argument facultatif
    public function formComplexAttr(?array $attr=null):array
    {
        return $this->formAttr($attr,true);
    }


    // formComplex
    // méthode pouvant être étendu, pour les formComplex
    // par défaut renvoie vers form
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        return $this->formComplexOutput($this->valueComplex($value,$option),$attr,$option);
    }


    // formComplexOutput
    // génère un élément de formulaire complexe mais sans passer value dans valueComplex
    public function formComplexOutput($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        $isForm = Base\Html::isFormTag($tag);
        $isTextTag = Base\Html::isTextTag($tag);
        $attr = $this->formComplexAttr($attr);
        $method = ($isForm === true)? $tag:$tag.'Cond';

        if(empty($attr['placeholder']) && $isTextTag === true && $this->hasNullPlaceholder())
        $attr['placeholder'] = 'NULL';

        $return = Base\Html::$method($value,$attr,$option);

        if(empty($return))
        $return = $this->formComplexEmptyPlaceholder($value);

        return $return;
    }


    // formComplexNothing
    // le html si rien à afficher
    public function formComplexNothing():string
    {
        return Base\Html::div($this->db()->lang()->text('common/nothing'),'nothing');
    }


    // formComplexEmptyPlaceholder
    // le html pour un placeholder vide ('' ou null)
    public function formComplexEmptyPlaceholder($value):string
    {
        return Base\Html::divCond($this->emptyPlaceholder($value),'empty-placeholder');
    }


    // formComplexWrap
    // fait un wrap à partir de formComplex plutôt que form
    public function formComplexWrap(?string $wrap=null,$pattern=null,$value=true,?array $attr=null,?array $replace=null,?array $option=null):string
    {
        return $this->makeFormWrap('formComplex',$wrap,$pattern,$value,$attr,$replace,$option);
    }


    // getDataAttr
    // retourne les dates attr pour la colonne
    public function getDataAttr(array $return):array
    {
        return $return;
    }
}

// init
Col::__init();
?>