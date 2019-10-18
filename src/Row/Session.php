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
                'subAdmin'=>['lemurInsert'=>false,'lemurUpdate'=>false,'lemurDelete'=>false],
                'admin'=>['lemurInsert'=>false,'lemurUpdate'=>false,'lemurDelete'=>false,'lemurTruncate'=>true]]],
    ];
}

// init
Session::__init();
?>