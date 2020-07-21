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

// jsonArray
// class for a column which offers a special input for json values
class JsonArray extends Core\Col\JsonAlias
{
    // config
    protected static array $config = [
        'required'=>true,
        'sortable'=>true,
        'complex'=>'add-remove',
        'cell'=>Lemur\Cell\JsonArray::class,
        'preValidate'=>'array',
        'onComplex'=>true,
        'tag'=>'inputText',
        'clean'=>true
    ];


    // prepare
    // arrange le tableau pour les méthode onGet et onSet
    protected function prepare(array $return)
    {
        if($this->getAttr('clean'))
        $return = Base\Arr::clean($return);

        $return = array_values($return);

        if(empty($return))
        $return = null;

        return $return;
    }


    // onGet
    // logique onGet pour un champ jsonArray
    protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(is_array($return))
        $return = $this->prepare($return);

        return $return;
    }


    // onSet
    // gère la logique onSet pour jsonArray, prepare est utilisé sur le tableau
    protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
    {
        if(is_array($return))
        $return = $this->prepare($return);

        $return = parent::onSet($return,$cell,$row,$option);

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
        $return = '';

        if(!empty($cell) && array_key_exists('index',$option))
        $return .= $this->beforeModel($option['index'],$value,$cell);

        $html = $this->form($value,$attr,$option);
        $return .= Html::div($html,'current');

        $return .= $this->makeModelUtils();

        return Html::div($return,'ele');
    }


    // getSpecificComponentAttr
    // ajoute le max count comme attribut
    public function getSpecificComponentAttr(array $return):array
    {
        $return = parent::getSpecificComponentAttr($return);

        $maxCount = $this->getMaxCount();
        if(is_int($maxCount))
        $return['data-max-count'] = $maxCount;

        return $return;
    }


    // getMaxCount
    // retourne le compte maximale pour le json array
    final public function getMaxCount():?int
    {
        $validate = $this->getAttr('validate');
        return $validate['jsonMaxCount'] ?? null;
    }


    // makeModelUtils
    // génère les outils pour le model comme move et delete
    final protected function makeModelUtils():string
    {
        $return = '';
        $lang = $this->db()->lang();

        if($this->getAttr('sortable'))
        $return .= Html::button(null,['icon-solo','move']);

        $data = ['confirm'=>$lang->text('common/confirm')];
        $return .= Html::button(null,['icon-solo','remove','data'=>$data]);

        return Html::div($return,'utils');
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

        if(static::isComplexTag($tag))
        {
            $value = (empty($value))? [null]:$value;
            $cell = ($value instanceof Core\Cell)? $value:null;
            $lang = $this->db()->lang();
            $attr = (!is_array($attr))? (array) $attr:$attr;
            $attr['name'] = $this->name();
            $option = Base\Arr::plus(['multi'=>true],$option);
            $model = $this->makeModel(null,$attr,null,$option);
            $data = ['html'=>$model];

            $html = '';
            foreach ($value as $i => $v)
            {
                $html .= $this->makeModel($v,$attr,$cell,Base\Arr::plus($option,['index'=>$i]));
            }
            $return .= Html::div($html,'playground');

            $buttonHtml = Html::span($lang->text('common/insert'));
            $buttonHtml .= Html::span(null,['icon-solo','add']);
            $return .= Html::button($buttonHtml,['insert','data'=>$data]);
        }

        else
        $return = Base\Debug::export($value);

        return $return;
    }


    // isComplexTag
    // retourne vrai si la tag est pour le formulaire complexe
    protected static function isComplexTag(string $value):bool
    {
        return $value === 'add-remove';
    }
}

// init
JsonArray::__init();
?>