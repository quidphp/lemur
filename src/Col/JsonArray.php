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

// jsonArray
// class for a column which offers a special input for json values
class JsonArray extends Core\Col\JsonAlias
{
    // config
    public static $config = [
        'required'=>true,
        'sortable'=>true,
        'complex'=>'add-remove',
        'cell'=>Lemur\Cell\JsonArray::class,
        'preValidate'=>'array',
        'onComplex'=>true,
        'tag'=>'inputText'
    ];


    // prepare
    // arrange le tableau pour les méthode onGet et onSet
    protected function prepare(array $return)
    {
        $return = Base\Arr::clean($return);
        $return = array_values($return);

        if(empty($return))
        $return = null;

        return $return;
    }


    // onGet
    // logique onGet pour un champ jsonArray
    protected function onGet($return,array $option)
    {
        if(!is_array($return))
        $return = parent::onGet($return,$option);

        if(is_array($return))
        $return = $this->prepare($return);

        return $return;
    }


    // onSet
    // gère la logique onSet pour jsonArray, prepare est utilisé sur le tableau
    protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        if(is_array($return))
        $return = $this->prepare($return);

        $return = parent::onSet($return,$row,$cell,$option);

        return $return;
    }


    // beforeModel
    // génère du html avant chaque model avec valeur
    // méthode pouvant être étendu
    protected function beforeModel(int $i,$value,Core\Cell $cell):string
    {
        return '';
    }


    // makeModel
    // génère le model pour jsonArray
    public function makeModel($value,array $attr,?Core\Cell $cell=null,array $option):string
    {
        $return = Html::divOp('ele');

        if(!empty($cell) && array_key_exists('index',$option))
        $return .= $this->beforeModel($option['index'],$value,$cell);

        $return .= Html::divOp('current');
        $return .= $this->form($value,$attr,$option);
        $return .= Html::divCl();

        $return .= $this->makeModelUtils();
        $return .= Html::divCl();

        return $return;
    }


    // makeModelUtils
    // génère les outils pour le model comme move et delete
    final protected function makeModelUtils():string
    {
        $return = Html::divOp('utils');
        $lang = $this->db()->lang();

        if($this->getAttr('sortable'))
        $return .= Html::button(null,['icon-solo','move']);

        $data = ['confirm'=>$lang->text('common/confirm')];
        $return .= Html::button(null,['icon-solo','remove','data'=>$data]);
        $return .= Html::divCl();

        return $return;
    }


    // prepareValueForm
    // prépare la valeur value pour le formulaire
    protected function prepareValueForm($return,$option)
    {
        return $this->valueComplex($return,$option);
    }


    // formComplex
    // génère le formComplex pour jsonArray
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);
        $value = $this->prepareValueForm($value,$option);

        if($tag === 'add-remove')
        {
            $value = (empty($value))? [null]:$value;
            $cell = ($value instanceof Core\Cell)? $value:null;
            $lang = $this->db()->lang();
            $attr = (!is_array($attr))? (array) $attr:$attr;
            $attr['name'] = $this->name();
            $option = Base\Arr::plus(['multi'=>true],$option);
            $model = $this->makeModel(null,$attr,null,$option);
            $data = ['html'=>$model];
            $return .= Html::divOp('playground');

            foreach ($value as $i => $v)
            {
                $return .= $this->makeModel($v,$attr,$cell,Base\Arr::plus($option,['index'=>$i]));
            }

            $return .= Html::divCl();

            $return .= Html::buttonOp(['insert','data'=>$data]);
            $return .= Html::span($lang->text('common/insert'));
            $return .= Html::span(null,['icon-solo','add']);
            $return .= Html::buttonCl();
        }

        else
        $return = Base\Debug::export($value);

        return $return;
    }
}

// init
JsonArray::__init();
?>