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

// uriAbsolute
// extended class for a column managing an absolute uri
class UriAbsolute extends Core\Col\UriAbsolute
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Uri::class,
        '@cms'=>[
            'generalExcerptMin'=>null]
    ];
}

// init
UriAbsolute::__init();
?>