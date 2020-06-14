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
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// email
// extended class for a column managing email
class Email extends Core\Col\Email
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Uri::class,
        '@cms'=>[
            'generalExcerptMin'=>null]
    ];
}

// init
Email::__init();
?>