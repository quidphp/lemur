<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// session
// extended class for a row of the session table, with cms logic
class Session extends Core\Row\Session
{
    // config
    public static $config = [
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['add'=>false,'remove'=>false,'modify'=>false],
                'admin'=>['add'=>false,'empty'=>true,'remove'=>false,'modify'=>false]]],
    ];
}

// init
Session::__init();
?>