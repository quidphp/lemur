<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// logSql
// class to represent a row of the logSql table, with cms logic
class LogSql extends Core\Row\LogSql
{
    // config
    public static $config = [
        'cols'=>array(
            'json'=>array('class'=>Lemur\Col\JsonExport::class)),
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
LogSql::__init();
?>