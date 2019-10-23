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

// queueEmail
// class to deal with a row of the queueEmail table, with cms logic
class QueueEmail extends Core\Row\QueueEmail
{
    // config
    public static $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]],
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
QueueEmail::__init();
?>