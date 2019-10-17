<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// email
// class to deal with a row of the email table, with cms logic
class Email extends Core\Row\Email
{
    // config
    public static $config = [
        '@cms'=>array(
            'permission'=>array(
                'contributor'=>array('view'=>false),
                'editor'=>array('view'=>false)))
    ];
}

// init
Email::__init();
?>