<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// registerSubmit
// class for the register submit route of the CMS
class RegisterSubmit extends Lemur\Route\RegisterSubmit
{
    //  config
    public static $config = [
        'parent'=>Register::class
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('register'))? true:false;
    }
}

// init
RegisterSubmit::__init();
?>