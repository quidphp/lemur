<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// loginSubmit
// abstract class for a login submit route
abstract class LoginSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'login/submit',
            'fr'=>'connexion/soumettre'],
        'match'=>[
            'method'=>'post',
            'role'=>'nobody',
            'post'=>['username','password'],
            'timeout'=>true,
            'genuine'=>true,
            'csrf'=>true],
        'timeout'=>[
            'trigger'=>['max'=>8,'timeout'=>600]],
        'parent'=>Login::class,
        'group'=>'submit',
        'log'=>null,
        'navigation'=>false // false car une route peut rediriger vers un download
    ];


    // routeSuccessDefault
    // retourne la route vers laquelle redirigé en cas de succès par défaut, si rien dans la mémoire
    abstract public function routeSuccessDefault();


    // canTrigger
    // s'assure que le rôle réel (non fake) est bien nobody
    final public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody();
    }


    // onSuccess
    // callback appelé lors d'un login réussi
    protected function onSuccess():void
    {
        static::timeoutReset('trigger');
    }


    // routeSuccess
    // retourne la route vers laquelle redirigé en cas de succès (si rien dans la mémoire)
    final public function routeSuccess()
    {
        return $this->routeSuccessMemory() ?: $this->routeSuccessDefault();
    }


    // routeSuccessMemory
    // retourne la route de redirection si existante et valide
    final public function routeSuccessMemory():?Lemur\Route
    {
        $return = null;
        $post = $this->post();

        if(!empty($post['redirect']))
        {
            $routes = static::routes();
            $request = Core\Request::newOverload($post['redirect']);
            $route = $request->route($routes);
            $role = $this->session()->role();

            if(!empty($route) && $route::isRedirectable($role))
            $return = $route;
        }

        return $return;
    }


    // routeFailure
    // retourne la route vers laquelle redirigé en cas d'erreur
    final public function routeFailure():Lemur\Route
    {
        return static::makeParent();
    }


    // proceed
    // lance l'opération de login standard
    final protected function proceed():bool
    {
        $return = false;
        $session = static::session();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        {
            $remember = $post['remember'] ?? null;
            $return = $session->loginProcess($post['credential'],$post['password'],['remember'=>$remember,'com'=>true]);
        }

        return $this->proceedAfter($return);
    }


    // post
    // retourne les données de post pour le login
    final protected function post():array
    {
        $return = [];
        $request = $this->request();
        $return['credential'] = (string) $request->get('username');
        $return['password'] = $this->password();
        $return['remember'] = ($request->exists('remember'));
        $return['redirect'] = $request->get('redirect');

        return $return;
    }


    // password
    // retourne le mot de passe
    final protected function password():string
    {
        return (string) $this->request()->get('password');
    }


    // setFlash
    // ajoute les données à l'objet flash
    final protected function setFlash():void
    {
        $post = $this->post();
        $flash = static::session()->flash();
        $flash->set('login/credential',$post['credential']);
        $flash->set('login/redirect',$post['redirect']);
        $flash->set('login/remember',$post['remember']);
    }
}

// init
LoginSubmit::__init();
?>