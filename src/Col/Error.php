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
use Quid\Core;
use Quid\Main;
use Quid\Orm;

// error
// extended class for a column that manages an error object
class Error extends Core\Col\Error
{
    // config
    protected static array $config = [];


    // specificComplexOutput
    // utilisé pour le output de l'erreur pour formComplex
    final public function specificComplexOutput($return,?Orm\Cell $cell=null,array $option)
    {
        return ($return instanceof Main\Error)? $return->html(true):null;
    }
}

// init
Error::__init();
?>