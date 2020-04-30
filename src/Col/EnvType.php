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
use Quid\Orm;

// envType
// class for the CMS envType column, updates itself automatically on commit
class EnvType extends Core\Col\EnvType
{
    // config
    protected static array $config = [];


    // varExport
    // permet d'envoyer un array dans var export
    final public static function varExport(array $return)
    {
        return Base\Debug::export($return);
    }


    // onGet
    // onGet spécial si contexte est cms, retourne le résultat debug/export
    final protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(is_array($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = static::varExport($return);

        return $return;
    }
}

// init
EnvType::__init();
?>