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

// fragment
// class for a column which contains URI fragments
class Fragment extends SlugAlias
{
    // config
    public static array $config = [
        'unique'=>false,
        'validate'=>[1=>'fragment']
    ];
}

// init
Fragment::__init();
?>