<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// jsonExport
// class for a column that contains json which should be exported
class JsonExport extends Core\Col\JsonAlias
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\JsonExport::class,
        'complex'=>'div',
        'onComplex'=>true,
        'visible'=>['validate'=>'notEmpty']
    ];


    // onSet
    // gère la logique onSet pour jsonExport
    // si la valeur est trop longue, n'envoie pas d'erreur mais retourne un tableau avec la clé incomplete à true
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        $return = parent::onSet($return,$cell,$row,$option);

        if(!empty($return) && $this->validate($return) !== true)
        $return = parent::onSet(static::invalidValue(),$cell,$row,$option);

        return $return;
    }


    // invalidValue
    // retourne la valeur pour représenter que la valeur enregistrée est invalide (trop longue)
    final public static function invalidValue():array
    {
        return ['incomplete'=>true];
    }
}

// init
JsonExport::__init();
?>