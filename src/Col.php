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
use Quid\Base\Html;

// col
// extended class to represent an existing column within a table, adds cms config
class Col extends Core\Col
{
    // config
    public static $config = [
        'onComplex'=>null, // callable pour onComplex, si true alors utilise la méthode onGet lors de la création des éléments de formulaires complexes
        '@cms'=>[
            'anchorCorner'=>false,
            'absolutePlaceholder'=>false,
            'filter'=>true,
            'filterEmptyNotEmpty'=>true,
            'quickEdit'=>true,
            'relationExport'=>null, // si la colonne doit être incluses comme exporation de relation (par exemple user s'exporte en plusieurs champs dans le CSV)
            'generalExcerptMin'=>100]
    ];


    // isQuickEditable
    // retourne vrai si la colonne est éditable rapidement via le cms
    final public function isQuickEditable():bool
    {
        return $this->getAttr('quickEdit') === true && !$this->isPlainTag(null,true);
    }

    
    // specificComponent
    // génère le html pour le specific component de la colonne
    // utilisé dans les formulaires spécifiques de lemur
    final public function specificComponent($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $compAttr = $this->getSpecificComponentAttr();
        $option = Base\Arr::plus(['context'=>'cms:specific'],$option);
        $return = Html::div($this->formComplex($value,$attr,$option),$compAttr);
        
        return $return;
    }
    
    
    // onComplex
    // permet de formater une valeur simple vers un type plus complexe
    // utilisé lors de la génération d'un élément de formulaire, si onComplex est true renvoie à onGet
    final protected function onComplex($return,array $option)
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
    final public function valueComplex($return=true,?array $option=null)
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
    final public function complexTag(?array $attr=null):string
    {
        return $this->tag($attr,true);
    }


    // formComplexAttr
    // retourne les attributs de formulaires complexes avec un tableau d'attributs en argument facultatif
    final public function formComplexAttr(?array $attr=null):array
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
    final public function formComplexOutput($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        if(Base\Html::isFormTag($tag))
        {
            $isTextTag = Base\Html::isTextTag($tag);
            $attr = $this->formComplexAttr($attr);

            if(empty($attr['placeholder']) && $isTextTag === true && $this->hasNullPlaceholder())
            $attr['placeholder'] = 'NULL';

            $return = Base\Html::$tag($value,$attr,$option);
        }

        else
        {
            $return = Base\Obj::cast($value);
            $return = Base\Str::cast($return);
        }

        if(empty($return))
        $return = $this->formComplexEmptyPlaceholder($value);

        return $return;
    }


    // formComplexNothing
    // le html si rien à afficher
    final public function formComplexNothing():string
    {
        return Base\Html::div($this->db()->lang()->text('common/nothing'),'nothing');
    }


    // formComplexEmptyPlaceholder
    // le html pour un placeholder vide ('' ou null)
    final public function formComplexEmptyPlaceholder($value):string
    {
        return Base\Html::divCond($this->emptyPlaceholder($value),'empty-placeholder');
    }


    // formComplexWrap
    // fait un wrap à partir de formComplex plutôt que form
    final public function formComplexWrap(?string $wrap=null,$pattern=null,$value=true,?array $attr=null,?array $replace=null,?array $option=null):string
    {
        return $this->makeFormWrap('specificComponent',true,$wrap,$pattern,$value,$attr,$replace,$option);
    }


    // getDataAttr
    // retourne les attr pour la colonne
    public function getDataAttr(array $return):array
    {
        return $return;
    }

    
    // getFormElementAttr
    // retourne les data attr complet pour le form element
    final public function getFormElementAttr($attr=null):array
    {
        $return = array('form-element');
        $data = ['name'=>$this,'group'=>$this->group(),'col'=>$this::className(true),'tag'=>$this->complexTag()];

        if($this->isRequired())
        $return[] = 'required';
        
        if($this->hasFormLabelId($attr,true))
        $return[] = 'cursor-pointer';
        
        $return['data'] = $this->getDataAttr($data);

        return $return;
    }
    
    
    // getSpecificComponentAttr
    // retourne les attr pour le specific component
    final public function getSpecificComponentAttr($return=null):array
    {
        if(!is_array($return))
        $return = (array) $return;
        
        $return[] = 'specific-component';
        
        if($this->getAttr('anchorCorner',true))
        $return['data-anchor-corner'] = true;
        
        if($this->getAttr('absolutePlaceholder',true))
        $return['data-absolute-placeholder'] = true;
        
        return $return;
    }
}

// init
Col::__init();
?>