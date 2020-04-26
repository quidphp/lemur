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
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// jsonExport
// class for a column that contains json which should be exported
class JsonExport extends Core\Col\JsonAlias
{
    // config
    public static array $config = [
        'cell'=>Lemur\Cell\JsonExport::class,
        'complex'=>'div',
        'onComplex'=>true,
        'visible'=>['validate'=>'notEmpty']
    ];


    // varExport
    // permet d'envoyer un array dans var export
    final public static function varExport(array $return)
    {
        return Base\Debug::export($return);
    }


    // onGet
    // onGet spécial si contexte est cms, retourne le résultat debug/export
    final protected function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(is_array($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = static::varExport($return);

        return $return;
    }


    // onSet
    // gère la logique onSet pour jsonExport
    // si la valeur est trop longue, n'envoie pas d'erreur mais retourne un tableau avec la clé incomplete à true
    final protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onSet($return,$row,$cell,$option);

        if(!empty($return) && $this->validate($return) !== true)
        $return = parent::onSet(static::invalidValue(),$row,$cell,$option);

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