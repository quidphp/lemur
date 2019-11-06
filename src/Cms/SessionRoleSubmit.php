<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;

// sessionRoleSubmit
// class for the route with the popup to apply a fake role to the current session
class SessionRoleSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'en'=>'session/exploration/submit',
            'fr'=>'session/exploration/soumettre'],
        'match'=>[
            'method'=>'post',
            'post'=>['role'],
            'genuine'=>true,
            'csrf'=>true],
        'row'=>Lemur\Row\User::class,
        'group'=>'submit'
    ];


    // onBefore
    // avant le trigger, vérifie que l'utilisateur peut accéder à lar oute
    protected function onBefore()
    {
        return $this->canTrigger();
    }


    // onFailure
    // callback appelé lors d'une erreur dans l'attribution
    protected function onFailure():void
    {
        $com = static::session()->com();
        $com->neg('sessionRole/failure');

        return;
    }


    // canTrigger
    // retourne vrai si la route peut être trigger
    public function canTrigger():bool
    {
        return static::makeParent()->canTrigger();
    }


    // routeSuccess
    // route sur succès
    protected function routeSuccess():Lemur\Route
    {
        return static::session()->historyPreviousRoute(Home::makeOverload());
    }


    // proceed
    // procède au changement de mot de passe
    public function proceed():bool
    {
        $return = false;
        $session = static::session();
        $post = $this->post();
        $action = $this->action();
        $post = $this->onBeforeCommit($post);
        $com = $session->com();

        if($post !== null)
        {
            $roles = $post['role'] ?? null;
            $return = true;

            if($action === 'reset' || empty($roles))
            {
                $session->fakeRolesEmpty();
                $com->pos('sessionRole/reset');
            }

            else
            {
                $session->setFakeRoles($roles);
                $com->pos('sessionRole/submit');
            }
        }

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // action
    // retourne l'action du formulaire
    protected function action():string
    {
        return ($this->request()->exists('reset'))? 'reset':'submit';
    }


    // post
    // retourne les données post avec les rôles pour l'exploration
    protected function post():array
    {
        $return = [];
        $request = $this->request();
        $value = $this->getAttr(['match','post',0]);

        if(!empty($value))
        {
            $v = $request->get($value);

            if(!is_array($v))
            $v = [$v];

            $v = Base\Arr::clean($v);
            $v = Base\Arr::cast($v);

            $return[$value] = $v;
        }

        return $return;
    }
}

// init
SessionRoleSubmit::__init();
?>