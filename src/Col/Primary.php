<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// primary
// extended class for dealing with a column which has an auto increment primary key
class Primary extends Core\Col\Primary
{
    // config
    public static $config = [
        '@cms'=>[
            'search'=>true]
    ];
}

// config
Primary::__config();
?>