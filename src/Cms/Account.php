<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// account
// class for the account route of the CMS, by default redirects to the user's specific route
class Account extends Lemur\Route\Account
{
    // trait
    use _common;


    // config
    public static $config = [
        'match'=>[
            'role'=>['>'=>'user']]
    ];


    // canTrigger
    // vérifie si le user peut aller voir son compte
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('account'))? true:false;
    }


    // trigger
    // ne fait rien
    final public function trigger()
    {
        return;
    }


    // onAfter
    // après trigger renvoie vers la page specifique du user
    final protected function onAfter()
    {
        return static::sessionUser()->route();
    }
}

// init
Account::__init();
?>