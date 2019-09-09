<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base\Html;
use Quid\Lemur;
use Quid\Core;

// relation
// extended abstract class extended for relation
abstract class Relation extends Core\Col\Relation
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>[
                'specific'=>Lemur\Cms\Specific::class,
                'specificRelation'=>Lemur\Cms\SpecificRelation::class]]
    ];


    // onGet
    // logique onGet pour un champ files
    // affichage spéciale si le contexte est cms:general
    public function onGet($return,array $option)
    {
        if($return instanceof Core\Cell\Relation && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        $return = Html::divCond($return->generalOutput($option),'relation');

        else
        $return = parent::onGet($return,$option);

        return $return;
    }
}

// config
Relation::__config();
?>