<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;

// _log
// trait to set permissions for a log row
trait _log
{
    // config
    protected static array $configLemurLog = [
        'cacheEmpty'=>false,
        'permission'=>[
            'contributor'=>['update'=>false],
            'editor'=>['update'=>false]],
        '@cms'=>[
            'permission'=>[
                '*'=>['homeFeed'=>false],
                'contributor'=>['view'=>false,'lemurDelete'=>false],
                'editor'=>['view'=>false,'lemurDelete'=>false],
                'subAdmin'=>['lemurInsert'=>false,'lemurDelete'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}
?>