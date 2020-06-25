<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// session
// extended class for a row of the session table, with cms config
class Session extends Core\Row\Session
{
    // config
    protected static array $config = [
        '@cms'=>[
            'permission'=>[
                '*'=>['homeFeed'=>false],
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false,'lemurUpdate'=>false,'lemurDelete'=>false],
                'admin'=>['lemurInsert'=>false,'lemurUpdate'=>false,'lemurDelete'=>false,'lemurTruncate'=>true]]],
    ];
}

// init
Session::__init();
?>