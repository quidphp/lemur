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

// uriAbsolute
// extended class for a column managing an absolute uri
class UriAbsolute extends Core\Col\UriAbsolute
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Uri::class,
        '@cms'=>[
            'generalExcerpt'=>null]
    ];
}

// init
UriAbsolute::__init();
?>