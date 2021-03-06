<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
            $return = (in_array($tag,['checkbox','search'],true) && $relation->size() > 1);
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
                $return = Base\Arr::replace($return,$all);
            }

            $return = $return ?: $all;
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