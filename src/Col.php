<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Orm;

// col
// extended class to represent an existing column within a table, adds cms config
class Col extends Core\Col
{
    // config
    protected static array $config = [
        'general'=>null, // la colonne est considéré comme général
        'onComplex'=>null, // callable pour onComplex, si true alors utilise la méthode onGet lors de la création des éléments de formulaires complexes
        'panel'=>null, // retourne le panel de la colonne
        'relationSearchRequired'=>false, // si la recherche est obligatoire pour une relation
        'relationExcerpt'=>75, // longueur de l'excerpt, utilisé entre autre pour les relations
        'generalExcerpt'=>null, // excerpt min pour l'affichage dans general du cms
        '@cms'=>[
            'onGeneralOutput'=>null, // callback pour général output
            'anchorCorner'=>false,
            'absolutePlaceholder'=>false,
            'filter'=>true,
            'filterEmptyNotEmpty'=>true,
            'quickEdit'=>true,
            'relationExport'=>null, // si la colonne doit être incluses comme exporation de relation (par exemple user s'exporte en plusieurs champs dans le CSV)
            'generalExcerpt'=>100]
    ];


    // panels
    protected static array $panels = [ // détermine les panels à utiliser à partir des patterns
        'en'=>'en',
        'fr'=>'fr',
        'enum'=>'relation',
        'set'=>'relation'
    ];


    // isQuickEditable
    // retourne vrai si la colonne est éditable rapidement via le cms
    final public function isQuickEditable():bool
    {
        return $this->getAttr('quickEdit') === true && !$this->isPlainTag(null,true);
    }


    // isGeneral
    // retourne vrai si la colonne doit apparaître dans general
    // si la valeur de la colonne est la string lang, envoie dans generalCurrentLang de col (en fonction du code lang de boot)
    final public function isGeneral():bool
    {
        $return = false;

        if($this->getAttr('general') === 'lang')
        $return = static::generalCurrentLang($this);
        else
        $return = $this->getAttr('general',true) === true;

        return $return;
    }


    // isRelationSearchRequired
    // retourne vrai si la recherche est requise pour la relation
    final public function isRelationSearchRequired():bool
    {
        return $this->getAttr('relationSearchRequired') === true;
    }


    // generalExcerpt
    // retourne la longueur de l'excerpt pour general
    final public function generalExcerpt():?int
    {
        return $this->getAttr('generalExcerpt');
    }


    // panel
    // retourne le panel de la colonne
    // retourne la string default si vide
    final public function panel():string
    {
        $return = $this->getAttr('panel');

        if(empty($return) || !is_string($return))
        $return = 'default';

        return $return;
    }


    // prepareAttr
    // permet de préparer certains attributs pour lemur
    protected function prepareAttr(array $return,Orm\ColSchema $schema):array
    {
        $return = parent::prepareAttr($return,$schema);

        if(!isset($return['panel']))
        {
            $patternType = $schema->patternType();
            if(!empty($patternType) && array_key_exists($patternType,static::$panels))
            $return['panel'] = static::$panels[$patternType];
        }

        return $return;
    }


    // valueExcerpt
    // créer une version résumé de la valeur si la longueur dépasse l'attribut excerpt
    final public function valueExcerpt($return,?array $option=null)
    {
        $option = Base\Arr::plus(['mb'=>true,'stripTags'=>true],$option);
        $excerpt = $this->getAttr('relationExcerpt');

        if(is_int($excerpt))
        {
            if(is_array($return))
            $return = Base\Arr::valuesExcerpt($excerpt,$return,true,$option);

            elseif(is_string($return))
            $return = Html::excerpt($excerpt,$return,$option);
        }

        return $return;
    }



    // specificComponent
    // génère le html pour le specific component de la colonne
    // utilisé dans les formulaires spécifiques de lemur
    final public function specificComponent($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $compAttr = [];
        $compAttr = $this->getSpecificComponentAttr($compAttr);
        $option = (array) $option;
        $return = Html::div($this->formComplex($value,$attr,$option),$compAttr);

        return $return;
    }


    // onComplex
    // permet de formater une valeur simple vers un type plus complexe
    // utilisé lors de la génération d'un élément de formulaire, si onComplex est true renvoie à onGet
    final protected function onComplex($return,?Orm\Cell $cell=null,array $option)
    {
        $return = $this->value($return);
        $onComplex = $this->getAttr('onComplex');

        if($onComplex === true)
        {
            $return = $this->attrOrMethodCall('onGet',$return,$cell,$option);
            $return = $this->specificComplexOutput($return,$cell,$option);
        }

        elseif(!empty($onComplex))
        $return = $onComplex($return,$cell,$option);

        return $return;
    }


    // specificComplexOutput
    // utilisé pour le output onComplex pour formComplex
    public function specificComplexOutput($return,?Orm\Cell $cell=null,array $option)
    {
        return $return;
    }


    // valueComplex
    // génère une valeur en vue de l'affichage dans un élément de formulaire complexe
    final public function valueComplex($return=true,?array $option=null)
    {
        $option = (array) $option;
        $cell = ($return instanceof Cell)? $return:null;
        $return = $this->value($return);
        $return = $this->onComplex($return,$cell,$option);

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

            if(is_array($return))
            $return = Base\Debug::export($return);

            else
            $return = Base\Str::cast($return);
        }

        if(Base\Vari::isReallyEmpty($return))
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
        return $this->makeFormWrap('formComplex',true,$wrap,$pattern,$value,$attr,$replace,$option);
    }


    // specificComponentWrap
    // fait un wrap à partir de specificComponent
    final public function specificComponentWrap(?string $wrap=null,$pattern=null,$value=true,?array $attr=null,?array $replace=null,?array $option=null):string
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
        $return = ['form-element'];
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
    public function getSpecificComponentAttr(array $return):array
    {
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