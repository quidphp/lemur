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

// textarea
// extended class for a column which is editable through a textarea input
class Textarea extends Core\Col\Textarea
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>['tableRelation'=>Lemur\Cms\SpecificTableRelation::class]]
    ];
}

// config
Textarea::__config();
?>