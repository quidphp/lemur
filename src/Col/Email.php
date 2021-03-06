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

// email
// extended class for a column managing email
class Email extends Core\Col\Email
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Uri::class,
        '@cms'=>[
            'generalExcerpt'=>null]
    ];
}

// init
Email::__init();
?>