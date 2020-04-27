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

// set
// class for a column containing a set relation (many)
class Set extends Core\Col\Set
{
    // config
    protected static array $config = [
        '@cms'=>[
            'sortable'=>true,
            'relationHtmlSortable'=>"<div class='choice'><div class='choice-in'><button type='button' class='icon-solo move'></button>%</div></div>"]
    ];


    // isSortable
    // retourne vrai si la relation est sortable
    final public function isSortable():bool
    {
        $return = false;

        if($this->getAttr('sortable') === true)
        {
            $tag = $this->complexTag();
            $relation = $this->relation();

            if(in_array($tag,['checkbox','search'],true) && $relation->size() > 1)
            $return = true;
        }

        return $return;
    }


    // getDataAttr
    // retourne les datas attr pour la colonne
    final public function getDataAttr(array $return):array
    {
        if($this->isSortable())
        $return['sortable'] = true;

        return parent::getDataAttr($return);
    }


    // onGet
    // logique onGet pour un champ relation
    // affichage spéciale si le contexte est cms:general
    final protected function onGet($return,array $option)
    {
        if($return instanceof Core\Cell\Relation && !$return->isNull() && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        $return = $return->generalOutput($option);

        else
        $return = parent::onGet($return,$option);

        return $return;
    }


    // prepareStandardRelation
    // retourne la relation pour un input avec choice
    // si sortable, met les éléments cochés en ordre au début de la liste
    final protected function prepareStandardRelation($value):array
    {
        $return = [];

        if($this->isSortable())
        {
            $relation = $this->relation();
            $all = $relation->all();

            if(is_string($value))
            $value = Base\Set::arr($value);

            if(is_array($value))
            {
                $return = Base\Arr::gets($value,$all);
                $all = Base\Arr::unsets($value,$all);
                $return = Base\Arr::merge($return,$all);
            }

            if(empty($return))
            $return = $all;
        }

        else
        $return = parent::prepareStandardRelation($value);

        return $return;
    }


    // prepareChoiceOption
    // retourne le html pour wrapper les choix
    final protected function prepareChoiceOption(array $return,bool $autoHidden=false):array
    {
        $return = parent::prepareChoiceOption($return,$autoHidden);

        if($this->isSortable())
        $return['html'] = $this->getAttr('relationHtmlSortable');

        return $return;
    }
}

// init
Set::__init();
?>