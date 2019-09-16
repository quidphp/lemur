<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;

// serialize
// extended class for a column which should serialize its value
class Serialize extends Core\Col\Serialize
{
    // config
    public static $config = [];


    // onGet
    // onGet spécial si contexte est cms, retourne le résultat debug/export
    public function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(is_array($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = Base\Debug::export($return);

        return $return;
    }
}

// config
Serialize::__config();
?>