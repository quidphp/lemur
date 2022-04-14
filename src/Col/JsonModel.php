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
use Quid\Orm;

// jsonModel
// class for a column which offers a configurable complex input for json values
class JsonModel extends JsonArray
{
    // config
    protected static array $config = [
        'onModel'=>null
    ];


    // onModel
    // génère le formulaire, peut être remplacé par une callable dans la propriété onModel
    protected function onModel($value,array $attr,?Core\Cell $cell,array $option):string
    {
        return $this->form($value,$attr,$option);
    }


    // onPrepare
    // méthode à étendre pour préparer les données du formulaire
    protected function onPrepare(array $return):?array
    {
        static::throw('methodNeedsToBeExtended');

        return $return;
    }


    // preValidatePrepare
    // prépare le tableau de chargement avant la prévalidation
    final public function preValidatePrepare($value):?array
    {
        return (Base\Arrs::is($value))? Base\Column::keySwap($value):null;
    }


    // prepare
    // prépare les données du formulaire
    final protected function prepare(array $return,?Orm\Cell $cell=null):?array
    {
        if(Base\Arr::isAssoc($return))
        $return = $this->preValidatePrepare($return);

        elseif(Base\Column::is($return))
        $return = $this->attrOrMethodCall('onPrepare',$return,$cell);

        return (is_array($return))? (array_values($return) ?: null):null;
    }


    // makeModelCurrent
    // génère le champ du modèle pour jsonArray
    protected function makeModelCurrent($value,array $attr,?Core\Cell $cell,array $option)
    {
        return $this->attrOrMethodCall('onModel',$value,$attr,$cell,$option);
    }


    // makeModelFormElement
    // utilitaire pour génère un formulaire pour un élément du modèle
    // utile pour les champs qui utilisent le onModel ou qui étendent
    final public static function makeModelFormElement(string $type,string $tag,string $label,bool $required,$value,array $attr,array $option):string
    {
        $r = '';
        $name = $attr['name'].'['.$type.']';

        $attr = Base\Arr::plus($attr,['name'=>$name]);
        $form = [$tag,$value,$attr,$option];

        if($required === true)
        $label = '*'.$label;
        $label .= ':';

        $r .= Html::formWrap($label,$form,'divtable');

        $tagAttr = ['model-form-element',$type];

        return Html::div($r,$tagAttr);
    }
}

// init
JsonModel::__init();
?>