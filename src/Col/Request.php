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

// request
// extended class for a column that manages a request object
class Request extends Core\Col\Request
{
    // config
    protected static array $config = [];


    // specificComplexOutput
    // utilisé pour le output de request pour formComplex
    final public function specificComplexOutput($return,?Orm\Cell $cell=null,array $option)
    {
        return ($return instanceof Core\Request)? Base\Debug::export($return->safeInfo()):null;
    }
}

// init
Request::__init();
?>