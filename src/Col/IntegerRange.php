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

// integerRanger
// class for an integer column that supports range
class IntegerRange extends Core\Col\Integer
{
    // config
    public static $config = [
        'complex'=>'inputNumericRange',
        'required'=>true,
        'keyboard'=>'decimal',
        'permission'=>[
            '*'=>[
                'nullPlaceholder'=>false]],
        'range'=>[ // custom, défini la range
            'min'=>1,
            'max'=>100,
            'inc'=>1]
    ];


    // showDetailsMaxLength
    // n'affiche pas le max length
    public function showDetailsMaxLength():bool
    {
        return false;
    }


    // validateClosure
    // retourne la closure pour la validation de range
    final public function validateClosure():?\Closure
    {
        return function(string $context,$value=null) {
            $return = null;

            if($context === 'lang')
            $return = 'integerRange';

            elseif($context === 'validate')
            {
                $range = $this->getRange();
                $return = (array_key_exists($value,$range));
            }

            return $return;
        };
    }


    // getRange
    // retourne la range paramétrée pour la colonne
    final public function getRange():array
    {
        $return = null;
        $range = $this->getAttr('range');
        $arg = [$range['min'],$range['max'],$range['inc'],true];
        $return = Base\Integer::range(...$arg);

        return $return;
    }


    // formComplex
    // génère le formulaire complex pour integerRange
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        if($tag === 'inputNumericRange')
        {
            $range = $this->getAttr('range');
            $return .= Html::button(null,['icon-solo','minus','data-range'=>'prev']);
            $inputAttr = Base\Arrs::replace($attr,['tag'=>'inputText','data'=>$range]);
            $return .= parent::formComplex($value,$inputAttr,$option);
            $return .= Html::button(null,['icon-solo','plus','data-range'=>'next']);
        }

        else
        $return .= parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
IntegerRange::__init();
?>