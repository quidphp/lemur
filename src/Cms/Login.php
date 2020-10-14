<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    protected static array $config = [
        'path'=>[
            null,
            'fr'=>'connexion',
            'en'=>'login']
    ];


    // onBefore
    // enregistre l'uri demandé si path n'est pas empty
    final protected function onBefore()
    {
        $return = parent::onBefore();

        if($return === true)
        {
            $routeRequest = $this->routeRequest();
            $lang = static::boot()->lang();
            $langCode = $lang->currentLang();
            $path = $routeRequest->routePath($langCode);
            $request = $this->request();
            $pathMatch = $request->pathMatch();

            if(!empty($pathMatch) && $pathMatch !== $path)
            {
                $session = static::session();
                $flash = $session->flash();
                $redirect = $this->request()->absolute();
                $flash->set('login/redirect',$redirect);
                $return = false;
            }
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
        $lang = static::lang();
        $flash = $session->flash();
        $redirect = $flash->get('login/redirect');
        $username = $flash->get('login/credential');
        $username = $username ?: $session->remember('credential');
        $usernameLabel = $lang->text('login/usernameEmail');
        $remember = $flash->get('login/remember') ?? true;

        $r .= Html::inputHidden($redirect,'redirect');

        $topHtml = $table->col('username')->formWrap('divtable',$usernameLabel.':',$username,['inputmode'=>'email']);
        $topHtml .= $table->col('password')->formWrap('divtable','%:');
        $r .= Html::div($topHtml,'top');

        $label = [$lang->text('login/remember'),['data-tooltip'=>$lang->text('tooltip/rememberMe')]];
        $formWrap = Html::formWrap($label,['inputCheckbox',1,['name'=>'remember','checked'=>$remember]],'reverse');
        $bottomHtml = Html::div($formWrap,'left');

        $submit = Html::submit(static::label(),$this->submitAttr());
        $bottomHtml .= Html::div($submit,'right');

        $r .= Html::div($bottomHtml,'bottom');
        $r .= Html::formCl();

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