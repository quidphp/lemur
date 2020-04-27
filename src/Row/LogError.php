<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// logError
// class to represent a row of the logError table, with cms config
class LogError extends Core\Row\LogError
{
    // config
    protected static array $config = [
        'permission'=>[
            'contributor'=>['update'=>false,'delete'=>false],
            'editor'=>['update'=>false,'delete'=>false],
            'subAdmin'=>['update'=>false]],
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
LogError::__init();
?>