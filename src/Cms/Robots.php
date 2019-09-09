<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// robots
// class for the robots.txt route of the CMS
class Robots extends Core\Route\Robots
{
    // config
    public static $config = [
        'allow'=>false
    ];
}

// config
Robots::__config();
?>