<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// relation
// extended abstract class extended for a relation
abstract class Relation extends Core\Col\Relation
{
    // config
    public static array $config = [
        'specificLink'=>false,
        '@cms'=>[
            'anchorCorner'=>[self::class,'hasAnchorCorner'],
            'absolutePlaceholder'=>[self::class,'hasAbsolutePlaceholder'],
            'sortable'=>null,
            'specificLink'=>true, // fait un lien vers spécifique dans cms
            'route'=>[
                'specific'=>Lemur\Cms\Specific::class,
                'specificRelation'=>Lemur\Cms\SpecificRelation::class]]
    ];


    // isSortable
    // retourne vrai si la relation est sortable
    public function isSortable():bool
    {
        return false;
    }


    // getDataAttr
    // retourne les attr pour la colonne
    public function getDataAttr(array $return):array
    {
        $rel = $this->relation();
        $return['mode'] = $rel->mode();

        if($rel->isRelationTable())
        $return['relation-table'] = $rel->relationTable();

        return parent::getDataAttr($return);
    }


    // prepareRelationRadioCheckbox
    // méthode utilisé lors de la préparation d'une valeur relation radio ou checkbox, incluant search
    final protected function prepareRelationRadioCheckbox(array $return):array
    {
        $rel = $this->relation();

        if($this->getAttr('specificLink') && $rel->isRelationTable())
        {
            $relationTable = $rel->relationTable();

            if($relationTable->hasPermission('view'))
            {
                foreach ($return as $key => $value)
                {
                    $action = ($relationTable->hasPermission('lemurUpdate'))? 'modify':'view';
                    $segments = ['table'=>$relationTable,'primary'=>$key];
                    $specific = $this->route('specific',$segments);
                    $uri = $specific->uri();

                    if(!empty($uri))
                    {
                        $link = Html::a($uri,null,['icon-solo',$action]);
                        $return[$key] = [$value,$link];
                    }
                }
            }
        }

        return $return;
    }


    // prepareRelationPlainGeneral
    // méthode utilisé pour préparer l'affichage des relations plains (sans formulaire)
    // crée les routes spécifiques
    final public function prepareRelationPlainGeneral(array $array):array
    {
        $return = [];
        $array = parent::prepareRelationPlainGeneral($array);
        $route = $this->routeClassSafe('specific');
        $relation = $this->relation();
        $table = null;

        if($relation->isRelationTable())
        $table = $relation->relationTable();

        foreach ($array as $key => $value)
        {
            if(is_int($key) && !empty($table) && !empty($route) && $table->hasPermission('view','specific'))
            {
                $route = $route::make(['table'=>$table,'primary'=>$key]);
                $return[$key] = $route->a($value);
            }

            else
            $return[$key] = $value;
        }

        return $return;
    }


    // onGet
    // logique onGet pour un champ files
    // affichage spéciale si le contexte est cms:general
    protected function onGet($return,array $option)
    {
        if($return instanceof Core\Cell\Relation && !$return->isNull() && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        $return = $return->generalOutput($option);

        else
        $return = parent::onGet($return,$option);

        return $return;
    }


    // formComplex
    // génère un élément de formulaire pour les relations
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);
        $relation = $this->relation();
        $size = $relation->size();

        if($size > 0)
        {
            $method = 'formComplex'.ucfirst($tag);

            if(method_exists($this,$method))
            $return = $this->$method($value,$attr,$option);

            elseif(Html::isRelationTag($tag))
            $return = $this->formComplexStandard($value,$attr,$option);

            elseif(Html::isFormTag($tag,true))
            $return = $this->form($value,$attr,$option);

            else
            $return = $this->formComplexPlain($value,$attr,$option);
        }

        else
        $return = $this->formComplexNothing();

        return $return;
    }


    // formComplexSearch
    // génère un élément de formulaire pour la recherche
    final protected function formComplexSearch($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $option = Base\Arr::plus(['button'=>true],$option);
        $rel = $this->relation();
        $mode = $rel->mode();
        $size = $rel->size();
        $lang = $this->db()->lang();

        $route = $this->route('specificRelation',['table'=>$this->table(),'col'=>$this,'selected'=>true]);
        if($route->canTrigger())
        {
            $query = $route->getSearchQuery();

            $placeholder = $attr['placeholder'] ?? $lang->text('common/search');
            if(is_array($attr) && array_key_exists('placeholder',$attr))
            unset($attr['placeholder']);

            if($placeholder === true)
            $placeholder = $rel->label();

            if(is_string($placeholder))
            $placeholder .= " ($size)";

            $searchMinLength = ($rel->isRelationTable())? $rel->relationTable()->searchMinLength():$this->table()->searchMinLength();
            $required = ($this->isRelationSearchRequired())? true:null;

            $data = ['query'=>$query,'separator'=>$route::getDefaultSegment(),'mode'=>$mode,'required'=>$required,'char'=>$route::getReplaceSegment(),'pattern'=>['minLength'=>$searchMinLength]];
            if($route->hasOrder())
            $route = $route->changeSegment('order',true);
            $data['href'] = $route;

            $id = $attr['id'] ?? null;
            if(is_array($attr) && array_key_exists('id',$attr))
            unset($attr['id']);

            $return .= Html::divOp(['input-popup']);

            $return .= Html::divOp(['data'=>['absolute-placeholder'=>true]]);
            $return .= Html::divOp('input');
            $return .= Html::inputText(null,['placeholder'=>$placeholder,'name'=>true,'data'=>$data,'id'=>$id,'inputmode'=>'search']);
            if($option['button'] === true)
            $return .= Html::button(null,['icon-solo','search']);
            $return .= Html::divCl();
            $return .= Html::divCl();

            $return .= Html::divOp(['popup','tabindex'=>0]);
            $return .= $route->orderSelect();
            $return .= Html::div(null,'results');
            $return .= Html::divCl();

            $return .= Html::divCl();

            $return .= Html::divOp('current');
            $return .= $this->formHidden();
            $return .= $this->formComplexSearchChoices($value,$attr,$option);
            $return .= Html::divCl();
        }

        return $return;
    }


    // formComplexSearchChoices
    // génère un checkbox à partir de la relation
    final public function formComplexSearchChoices($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $value = $this->valueComplex($value,$option);
        $rel = $this->relation();
        $relation = $rel->getKeyValue($value);
        $option = (array) $option;
        $option = $this->prepareChoiceOption($option,false);

        if(is_array($relation) && !empty($relation))
        {
            $tag = ($this->isSet())? 'checkbox':'radio';
            $attr = Base\Arr::plus($attr,['tag'=>$tag]);
            $option = Base\Arr::plus($option,['value'=>$value]);
            $relation = $this->valueExcerpt($relation);
            $relation = $this->prepareRelationRadioCheckbox($relation);
            $return = $this->formComplexOutput($relation,$attr,$option);
        }

        return $return;
    }


    // formComplexStandard
    // génère un champ pour relation standard comme select, radio, checkbox et multiselect
    final public function formComplexStandard($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $value = $this->valueComplex($value,$option);
        $rel = $this->relation();
        $tag = $this->complexTag($attr);
        $attr = Base\Arr::plus($attr,['tag'=>$tag]);
        $option = Base\Arr::plus($option,['value'=>$value]);
        $relation = $this->prepareStandardRelation($value);
        $relation = $this->valueExcerpt($relation);

        if($tag === 'select' && !array_key_exists('title',$option))
        $option['title'] = true;

        if(in_array($tag,['radio','checkbox'],true))
        {
            $option = $this->prepareChoiceOption($option,true);
            $relation = $this->prepareRelationRadioCheckbox($relation);
        }

        $return .= $this->formComplexOutput($relation,$attr,$option);

        return $return;
    }


    // formComplexPlain
    // génère un élément de formulaire plain, c'est à dire sans balise de formulaire (comme une div)
    final public function formComplexPlain($value,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);
        $value = $this->valueComplex($value,$option);
        $relation = $this->relation();

        if($relation->isRelationTable())
        {
            $table = $relation->relationTable();
            $value = $relation->getKeyValue($value,true,true,$option);

            if(!empty($value))
            {
                $value = $this->valueExcerpt($value);
                $value = $this->prepareRelationPlainGeneral($value);
                $value = $this->relationPlainHtml($value);
                $return .= $this->formComplexOutput($value,$attr,$option);
            }
        }

        else
        {
            $value = $relation->get($value,true,true,$option);

            if($value !== null)
            {
                $value = $this->valueExcerpt($value);

                if(!Base\Html::isFormTag($tag))
                $value = $this->relationPlainHtml($value);

                $return .= $this->formComplexOutput($value,$attr,$option);
            }
        }

        if(empty($return))
        $return = $this->formComplexEmptyPlaceholder($value);

        return $return;
    }


    // prepareStandardRelation
    // retourne la relation pour un input avec choice
    // désactive la cache
    // méthode pouvant être étendu
    protected function prepareStandardRelation($value):array
    {
        $return = $this->relation()->all(false);

        return $return;
    }


    // prepareChoiceOption
    // retourne le html pour wrapper les choix
    // méthode pouvant être étendu
    protected function prepareChoiceOption(array $return,bool $autoHidden=false):array
    {
        $return['autoHidden'] = $autoHidden;
        $return['html'] = $this->getAttr('relationHtml');

        return $return;
    }


    // relationPlainHtml
    // fait le html pour chaque choix de relation, lorsque le input est plain
    final public function relationPlainHtml($array):string
    {
        $return = '';

        if(!is_array($array))
        $array = (array) $array;

        foreach ($array as $value)
        {
            $return .= Html::liCond($value);
        }

        $return = Html::ulCond($return);

        return $return;
    }


    // hasAnchorCorner
    // retourne vrai s'il faut mettre l'attribut anchor-corner
    final public static function hasAnchorCorner(self $col):bool
    {
        return in_array($col->complexTag(),['search'],true);
    }


    // hasAbsolutePlaceholder
    // retourne vrai s'il faut mettre l'attribut absolute-placeholder
    final public static function hasAbsolutePlaceholder(self $col):bool
    {
        return false;
    }
}

// init
Relation::__init();