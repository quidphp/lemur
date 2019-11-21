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

// register
// class for the register route of the CMS
class Register extends Lemur\Route\Register
{
    // trait
    use _nobody;


    // config
    public static $config = [
        'parent'=>Login::class
    ];


    // submitClass
    // classe de la route pour soumettre le formulaire
    final public static function submitClass():string
    {
        return RegisterSubmit::getOverloadClass();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    final public function submitAttr()
    {
        return ['with-icon','add'];
    }


    // makeButtons
    // retourne un tableau avec les boutons sous le formulaire de connexion
    final protected function makeButtons():array
    {
        $return = [];
        $return['login'] = $this->makeLogin();
        $return['resetPassword'] = $this->makeResetPassword();

        return $return;
    }
}

// init
Register::__init();
?>