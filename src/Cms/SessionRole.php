<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// sessionRole
// class for the route with the popup to apply a fake role to the current session
class SessionRole extends Core\RouteAlias
{
    // trait
    use _modal;


    // config
    public static $config = [
        'path'=>[
            'en'=>'session/exploration',
            'fr'=>'session/exploration'],
        'match'=>[
            'ajax'=>true],
        'row'=>Lemur\Row\User::class
    ];


    // onBefore
    // avant le trigger, vérifie que l'utilisateur peut accéder à lar oute
    protected function onBefore()
    {
        return $this->canTrigger();
    }


    // canTrigger
    // retourne vrai si la route peut être trigger
    public function canTrigger():bool
    {
        $return = false;
        $session = static::session();

        if($session->allowFakeRoles())
        {
            $roles = $session->roles(false);
            if($this->rolesHasPermission('sessionFakeRole',$roles))
            $return = true;
        }

        return $return;
    }


    // submitRoute
    // route à utiliser pour submit
    public function submitRoute():Lemur\Cms\SessionRoleSubmit
    {
        return SessionRoleSubmit::makeOverload();
    }


    // trigger
    // trigge la route accountChangePassword
    public function trigger():string
    {
        $r = '';
        $r .= Html::divtableOpen();
        $r .= Html::h1(static::langText('sessionRole/title'));
        $r .= Html::divCond(static::langText('sessionRole/info'),'info');
        $r .= Html::divCond($this->makeForm(),'form');
        $r .= Html::divtableClose();

        return $r;
    }


    // makeForm
    protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $table = static::tableFromRowClass();
        $col = $table->col('role');
        $session = static::session();
        $fakeRoles = $session->getFakeRoles();
        $value = (!empty($fakeRoles))? $fakeRoles->keys():null;
        $role = $col->formComplex($value,['data-required'=>false]);

        $r .= $route->formOpen();
        $r .= Html::divOp('fields');
        $r .= Html::divCond($role,'field');
        $r .= Html::divCl();

        $r .= Html::divOp('action');

        if($session->hasFakeRoles())
        $r .= Html::submit(static::langText('sessionRole/reset'),['name'=>'reset','class'=>['submit','icon','reset','padLeft']]);

        $r .= Html::submit(static::langText('sessionRole/submit'),['name'=>'submit','class'=>['submit','icon','modify','padLeft']]);

        $r .= Html::divCl();

        $r .= Html::formClose();

        return $r;
    }


    // aDialog
    // retourne le lien dialog pour ouvrir la formulaire dans une box
    public function aDialog($attr=null):string
    {
        return $this->a(static::label(),Base\Attr::append($attr,['data'=>['modal'=>static::name()]]));
    }
}

// init
SessionRole::__init();
?>