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

// resetPasswordSubmit
// class for the submit reset password route of the CMS
class ResetPasswordSubmit extends Lemur\Route\ResetPasswordSubmit
{
    // config
    public static $config = [
        'parent'=>ResetPassword::class
    ];
    
    
    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool 
    {
        return (parent::canTrigger() && $this->hasPermission('resetPassword'))? true:false;
    }
}

// init
ResetPasswordSubmit::__init();
?>