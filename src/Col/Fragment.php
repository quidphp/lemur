<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;

// fragment
// class for a column which contains URI fragments
class Fragment extends SlugAlias
{
    // config
    protected static array $config = [
        'unique'=>false,
        'validate'=>['fragment']
    ];
}

// init
Fragment::__init();
?>