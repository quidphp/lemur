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

// accountChangePasswordSubmit
// class for the submit change password route in the CMS
class AccountChangePasswordSubmit extends Lemur\Route\AccountChangePasswordSubmit
{
    // config
    public static $config = [
        'match'=>[
            'session'=>'canLogin'],
        'parent'=>AccountChangePassword::class
    ];


    // canTrigger
    // vérifie si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('accountChangePassword'))? true:false;
    }


    // routeSuccess
    // route utilisé pour rediriger après le formulaire
    final public function routeSuccess():Lemur\Route
    {
        return static::session()->historyPreviousRoute(Home::make());
    }
}

// init
AccountChangePasswordSubmit::__init();
?>