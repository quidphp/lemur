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

// email
// class to deal with a row of the email table, with cms logic
class Email extends Core\Row\Email
{
    // config
    public static $config = [
        'cols'=>array(
            'content_fr'=>array('class'=>Lemur\Col\Textarea::class),
            'content_en'=>array('class'=>Lemur\Col\Textarea::class)),
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false]]]
    ];
}

// init
Email::__init();
?>