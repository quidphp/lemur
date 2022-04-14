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
use Quid\Lemur;
use Quid\Orm;

// jsonRelation
// class to manage a column containing a relation value to another column which is a jsonArray
class JsonRelation extends Core\ColAlias
{
    // trait
    use _jsonRelation;


    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\JsonRelation::class,
        'required'=>true
    ];


    // onGet
    // méthode onGet pour jsonRelation
    final protected function onGet($return,?Orm\Cell $cell,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(!empty($cell))
        {
            $value = $cell->value();
            $return = (is_int($value))? $cell->relationIndex($value):null;
        }

        return $return;
    }


    // onSet
    // gère la logique onSet pour jsonRelation
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        $fromCell = $this->fromCell();
        if(!empty($row[$fromCell]))
        {
            $cellForm = $this->relationCell($row[$fromCell]);

            if(empty($cellForm) || !$cellForm->isDataValid($return))
            $return = null;
        }

        return parent::onSet($return,$cell,$row,$option);
    }


    // formComplex
    // génère le formComplex pour jsonRelation avec le relation export
    final public function formComplex($input=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);
        $value = $this->valueComplex($input,$option);

        if(Html::isFormTag($tag,true))
        {
            $cell = ($input instanceof Core\Cell)? $input:null;
            $return .= parent::formComplex($value,$attr,$option);

            if(is_int($value) && !empty($cell))
            {
                $answer = $cell->relationIndex($value);
                $return .= Html::div(Base\Debug::export($answer),'relation-export');
            }
        }

        else
        $return = Base\Debug::export($value);

        return $return;
    }
}

// init
JsonRelation::__init();
?>