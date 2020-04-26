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

// account
// class for the account route of the CMS, by default redirects to the user's specific route
class Account extends Lemur\Route\Account
{
    // config
    public static array $config = [
        'match'=>[
            'session'=>'canAccess']
    ];


    // canTrigger
    // vérifie si le user peut aller voir son compte
    public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('account');
    }


    // trigger
    // ne fait rien
    public function trigger()
    {
        return;
    }


    // onAfter
    // après trigger renvoie vers la page specifique du user
    protected function onAfter()
    {
        return static::sessionUser()->route();
    }
}

// init
Account::__init();
?>