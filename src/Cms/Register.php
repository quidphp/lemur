<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
        'parent'=>Login::class,
        'row'=>Lemur\Row\User::class
    ];


    // submitClass
    // classe de la route pour soumettre le formulaire
    public static function submitClass():string
    {
        return RegisterSubmit::getOverloadClass();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    public function submitAttr()
    {
        return ['icon','padLeft','add'];
    }


    // makeButtons
    // retourne un tableau avec les boutons sous le formulaire de connexion
    protected function makeButtons():array
    {
        $return = [];
        $return['login'] = $this->makeLogin();
        $return['resetPassword'] = $this->makeResetPassword();
        $return['about'] = $this->makeAbout();

        return $return;
    }
}

// init
Register::__init();
?>