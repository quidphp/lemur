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
use Quid\Base\Html;
use Quid\Lemur;

// login
// class for the login route of the CMS
class Login extends Lemur\Route\Login
{
    // trait
    use _nobody;


    // config
    public static $config = [
        'path'=>[
            null,
            'fr'=>'',
            'en'=>'']
    ];


    // onBefore
    // enregistre l'uri demandé si path n'est pas empty
    final protected function onBefore()
    {
        $return = parent::onBefore();
        $request = $this->request();

        if(!$request->isPathMatchEmpty())
        {
            $session = static::session();
            $flash = $session->flash();
            $redirect = $this->request()->absolute();
            $flash->set('login/redirect',$redirect);
            $return = false;
        }

        return $return;
    }


    // onFallback
    // retourne la route login pour la redirection
    // seulement si la requête n'est pas ajax et l'url n'est pas celle de la requête courante
    final protected function onFallback($context=null)
    {
        $return = null;

        if($context === 'onBefore')
        {
            $request = $this->request();

            if(!$request->isAjax())
            {
                $route = static::make();

                if($route->uriRelative() !== $request->relative())
                $return = $route;
            }
        }

        return $return;
    }


    // onReplace
    // change le titre et background de la route
    final protected function onReplace(array $return):array
    {
        $return['title'] = $return['bootLabel'];
        $return['background'] = static::boot()->getOption('background');

        return $return;
    }


    // submitRoute
    // route pour soumettre le formulaire
    final public function submitRoute():Lemur\Route\LoginSubmit
    {
        return LoginSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    final public function submitAttr()
    {
        return ['with-icon','login'];
    }


    // makeForm
    // génère le form du login
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $r = $route->formOpen();
        $table = $this->db()->tables()->get('user');
        $session = static::session();
        $flash = $session->flash();
        $redirect = $flash->get('login/redirect');
        $username = $flash->get('login/credential') ?? $session->remember('credential');
        $usernameLabel = static::langText('login/usernameEmail');
        $remember = $flash->get('login/remember') ?? true;

        $r .= Html::inputHidden($redirect,'redirect');
        $r .= Html::divOp('top');
        $r .= $table->col('username')->formWrap('divtable',$usernameLabel.':',$username);
        $r .= $table->col('password')->formWrap('divtable','%:');
        $r .= Html::divClose();

        $r .= Html::divOp('bottom');
        $r .= Html::divOp('left');
        $r .= Html::formWrap(static::langText('login/remember'),['inputCheckbox',1,['name'=>'remember','checked'=>$remember]],'reverse');
        $r .= Html::divClose();

        $r .= Html::divOp('right');
        $r .= Html::submit(static::label(),$this->submitAttr());
        $r .= Html::divClose();
        $r .= Html::divClose();
        $r .= Html::formClose();

        return $r;
    }


    // makeButtons
    // retourne un tableau avec les boutons sous le formulaire de connexion
    final protected function makeButtons():array
    {
        $return = [];
        $return['register'] = $this->makeRegister();
        $return['resetPassword'] = $this->makeResetPassword();

        return $return;
    }
}

// init
Login::__init();
?>