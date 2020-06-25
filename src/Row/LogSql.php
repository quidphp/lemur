<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// logSql
// class to represent a row of the logSql table, with cms config
class LogSql extends Core\Row\LogSql
{
    // config
    protected static array $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]],
        'permission'=>[
            'contributor'=>['update'=>false,'delete'=>false],
            'editor'=>['update'=>false,'delete'=>false],
            'subAdmin'=>['update'=>false]],
        '@cms'=>[
            'permission'=>[
                '*'=>['homeFeed'=>false],
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
LogSql::__init();
?>