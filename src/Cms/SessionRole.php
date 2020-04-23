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
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;

// sessionRole
// class for the route with the popup to apply a fake role to the current session
class SessionRole extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_modal;


    // config
    public static $config = [
        'path'=>[
            'en'=>'session/exploration',
            'fr'=>'session/exploration'],
        'row'=>Lemur\Row\User::class
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        $return = false;
        $session = static::session();

        if(parent::canTrigger() && $session->allowFakeRoles())
        {
            $roles = $session->roles(false);
            if($this->rolesHasPermission('sessionFakeRole',$roles))
            $return = true;
        }

        return $return;
    }


    // submitRoute
    // route à utiliser pour submit
    final public function submitRoute():Lemur\Cms\SessionRoleSubmit
    {
        return SessionRoleSubmit::make();
    }


    // trigger
    // trigge la route accountChangePassword
    final public function trigger():string
    {
        $r = '';

        $r .= Html::h1(static::langText('sessionRole/title'));
        $r .= Html::divCond(static::langText('sessionRole/info'),'info');
        $r .= Html::divCond($this->makeForm(),'form');

        return $r;
    }


    // roles
    // retourne les roles à utiliser pour le formulaire
    final protected function roles():Main\Roles
    {
        $return = null;
        $session = static::session();
        $current = $session->role(false)->permission();
        $roles = static::boot()->roles();

        $return = $roles->filter(function(Main\Role $role) use ($current) {
            return ($role->permission() <= $current);
        });

        return $return;
    }


    // rolesForm
    // génère le formulaire des rôles
    final protected function rolesForm():string
    {
        $return = null;
        $table = static::tableFromRowClass();
        $col = $table->col('role');
        $session = static::session();
        $fakeRoles = $session->getFakeRoles();
        $value = (!empty($fakeRoles))? $fakeRoles->keys():null;
        $roles = $this->roles()->pair('label');
        $wrap = "<div class='choice'>%</div>";
        $return = Base\Html::checkboxesWithHidden($roles,$col->name(),['checked'=>$value,'html'=>$wrap]);

        return $return;
    }


    // makeForm
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $session = static::session();

        $r .= $route->formOpen();
        $r .= Html::divOp('fields');
        $r .= Html::divCond($this->rolesForm(),'field');
        $r .= Html::divCl();

        $r .= Html::divOp('action');

        if($session->hasFakeRoles())
        $r .= Html::submit(static::langText('sessionRole/reset'),['name'=>'reset','class'=>['with-icon','reset']]);

        $r .= Html::submit(static::langText('sessionRole/submit'),['name'=>'submit','class'=>['with-icon','modify']]);

        $r .= Html::divCl();

        $r .= Html::formClose();

        return $r;
    }
}

// init
SessionRole::__init();
?>