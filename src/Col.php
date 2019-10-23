<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// col
// extended class to represent an existing column within a table, adds cms config
class Col extends Core\Col
{
    // config
    public static $config = [
        '@cms'=>[
            'filter'=>true,
            'filterEmptyNotEmpty'=>true,
            'generalExcerptMin'=>100]
    ];


    // getDataAttr
    // retourne les dates attr pour la colonne
    public function getDataAttr(array $return):array
    {
        return $return;
    }
}

// init
Col::__init();
?>