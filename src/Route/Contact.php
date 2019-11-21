<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// contact
// abstract class for a contact form route
abstract class Contact extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'contact-us',
            'fr'=>'nous-joindre'],
        'row'=>Lemur\Row\Contact::class
    ];
}

// init
Contact::__init();
?>