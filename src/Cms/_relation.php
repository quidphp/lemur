<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;

// _relation
// trait that provides some initial configuration for a CMS relation route
trait _relation
{
    // trait
    use _common;


    // config
    public static $configRelationCms = [
        'history'=>false,
        'match'=>[
            'ajax'=>true,
            'session'=>'canLogin'],
        'group'=>'relation',
        'order'=>true
    ];
}
?>