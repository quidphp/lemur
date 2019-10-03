<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Lemur;

// date
// extended class for a date column, supports many date formats
class Date extends Core\Col\Date
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>['calendar'=>Lemur\Cms\SpecificCalendar::class]]
    ];
}

// init
Date::__init();
?>