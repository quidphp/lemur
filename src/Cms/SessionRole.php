<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    protected static array $config = [
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
            $return = ($this->rolesHasPermission('sessionFakeRole',$roles));
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
        $lang = static::lang();

        $r .= Html::h1($lang->text('sessionRole/title'));
        $r .= Html::divCond($lang->text('sessionRole/info'),'info');
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
        $return = $roles->filter(fn(Main\Role $role) => $role->permission() <= $current);

        return $return;
    }


    // rolesForm
    // génère le formulaire des rôles
    final protected function rolesForm():string
    {
        $table = static::tableFromRowClass();
        $col = $table->col('role');
        $session = static::session();
        $fakeRoles = $session->getFakeRoles();
        $value = (!empty($fakeRoles))? $fakeRoles->keys():null;
        $roles = $this->roles()->pair('label');
        $wrap = "<div class='choice'>%</div>";

        return Html::checkboxesWithHidden($roles,$col->name(),['checked'=>$value,'html'=>$wrap]);
    }


    // makeForm
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $session = static::session();
        $lang = static::lang();
        $html = '';
        $field = Html::divCond($this->rolesForm(),'field');

        $r .= $route->formOpen();
        $r .= Html::div($field,'fields');

        if($session->hasFakeRoles())
        $html .= Html::submit($lang->text('sessionRole/reset'),['name'=>'reset','class'=>['with-icon','reset']]);

        $html .= Html::submit($lang->text('sessionRole/submit'),['name'=>'submit','class'=>['with-icon','modify']]);

        $r .= Html::div($html,'action');
        $r .= Html::formCl();

        return $r;
    }
}

// init
SessionRole::__init();
?>