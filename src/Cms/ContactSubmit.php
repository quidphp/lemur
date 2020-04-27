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

// contactSubmit
// class for a contact submit route for the CMS
class ContactSubmit extends Lemur\Route\ContactSubmit
{
    // config
    protected static array $config = [
        'parent'=>Contact::class
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('contact');
    }


    // routeSuccess
    // redirige vers la dernière route valable de l'historique
    final public function routeSuccess()
    {
        return true;
    }
}

// init
ContactSubmit::__init();
?>