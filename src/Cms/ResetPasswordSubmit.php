<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// resetPasswordSubmit
// class for the submit reset password route of the CMS
class ResetPasswordSubmit extends Lemur\Route\ResetPasswordSubmit
{
    // config
    protected static array $config = [
        'parent'=>ResetPassword::class
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('resetPassword');
    }
}

// init
ResetPasswordSubmit::__init();
?>