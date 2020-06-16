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
use Quid\Orm;

// range
// class for a column managing a range (minimum, maximum, increment)
class Range extends Core\Col\JsonAlias
{
    // config
    protected static array $config = [
        'required'=>true,
        'check'=>['kind'=>'char'],
        'preValidate'=>'array',
        'detailMaxLength'=>false,
        'rangeDefault'=>[ // custom
            'min'=>0,
            'max'=>10,
            'inc'=>1],
        'formWrap'=>"<div class='range-input'>%label%%form%</div>"
    ];


    // hasFormLabelId
    // le champ contient différents labels
    final public function hasFormLabelId(?array $attr=null,bool $complex=false):bool
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
            $return = 'range';

            elseif($context === 'validate')
            $return = ($this->get($value) !== null);

            return $return;
        };
    }


    // onGet
    // sur onGet retourne un tableau associatif avec min, max ou inc
    final protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(is_array($return) && Base\Arr::isRange($return))
        $return = Base\Arr::keysChange([0=>'min',1=>'max',2=>'inc'],$return);

        return $return;
    }


    // formComplex
    // génère le formulaire complex pour range
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        if(Html::isFormTag($tag))
        {
            $inputs = $this->inputs($value);
            $wrap = $this->getAttr('formWrap');

            foreach ($inputs as $array)
            {
                $label = $array['label'].':';
                $input = ['inputText',$array['value'],$array['attr']];
                $return .= Html::formWrap($label,$input,$wrap);
            }
        }

        else
        $return .= parent::formComplex($value,$attr,$option);

        return $return;
    }


    // inputs
    // retourne les inputs à utiliser pour le formulaire
    final public function inputs($value):array
    {
        $return = [];
        $lang = $this->db()->lang();
        $name = $this->name().'[]';
        $pattern = $this->rulePattern();
        $required = $this->isRequired();
        $value = $this->get($value);
        $config = $this->getAttr('rangeDefault');

        foreach ($config as $key => $default)
        {
            $v = (is_array($value) && array_key_exists($key,$value))? $value[$key]:$default;
            $label = $lang->text('rangeInput/'.$key);
            $array = ['name'=>$name,'data-required'=>$required,'data-pattern'=>$pattern];
            $return[] = ['label'=>$label,'value'=>$v,'attr'=>$array];
        }

        return $return;
    }
}

// init
Range::__init();
?>