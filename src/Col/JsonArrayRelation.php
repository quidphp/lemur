<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// jsonArrayRelation
// class to manage a column containing a relation value to another column which is a jsonArray
class JsonArrayRelation extends Core\ColAlias
{
    // config
    public static $config = [
        'cell'=>Lemur\Cell\JsonArrayRelation::class,
        'required'=>true,
        'relationCols'=>null // custom
    ];


    // onGet
    // méthode onGet pour jsonArrayRelation
    final protected function onGet($return,array $option)
    {
        if($return instanceof Core\Cell)
        {
            $value = $return->value();
            $return = (is_int($value))? $return->relationIndex($value):null;
        }

        else
        $return = parent::onGet($return,$option);

        return $return;
    }


    // formComplex
    // génère le formComplex pour jsonArrayRelation
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);
        $value = $this->valueComplex($value,$option);

        if(Html::isFormTag($tag,true))
        {
            $cell = ($value instanceof Core\Cell)? $value:null;
            $return .= parent::formComplex($value,$attr,$option);

            if(is_int($value) && !empty($cell))
            {
                $lang = $this->db()->lang();

                $label = $cell->relationIndex($value);
                if(is_string($label))
                $return .= Html::div($label,'under-input');
                else
                $return .= Html::div($lang->text('common/nothing'),['under-input','nothing']);
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