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
use Quid\Orm;

// jsonArrayRelation
// class to manage a column containing a relation value to another column which is a jsonArray
class JsonArrayRelation extends Core\ColAlias
{
    // trait
    use _jsonRelation;


    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\JsonArrayRelation::class,
        'required'=>true
    ];


    // onGet
    // méthode onGet pour jsonArrayRelation
    final protected function onGet($return,?Orm\Cell $cell=null,array $option)
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
    // gère la logique onSet pour jsonArrayRelation
    final protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
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
    // génère le formComplex pour jsonArrayRelation avec le relation export
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
JsonArrayRelation::__init();
?>