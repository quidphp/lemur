<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// logout
// class for the logout route of the CMS
class Logout extends Lemur\Route\Logout
{
    // trait
    use _common;


    // config
    protected static array $config = [
        'match'=>[
            'session'=>'canAccess'],
        'parent'=>Login::class
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('logout');
    }
}

// init
Logout::__init();
?>