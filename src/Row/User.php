<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// user
// extended class for a row of the user table, with cms logic
class User extends Core\Row\User
{
    // config
    public static $config = [
        'permission'=>[
            '*'=>['cmsLogin'=>false],
            'admin'=>['cmsLogin'=>true],
            'subAdmin'=>['cmsLogin'=>true],
            'editor'=>['cmsLogin'=>true],
            'contributor'=>['cmsLogin'=>true]],
        '@cms'=>[
            'permission'=>[
                '*'=>['userWelcome'=>false],
                'admin'=>['export'=>true,'userWelcome'=>true],
                'subAdmin'=>['export'=>true,'userWelcome'=>true],
                'editor'=>['insert'=>false],
                'contributor'=>['insert'=>false]],
            'route'=>[
                'userWelcome'=>Lemur\Cms\SpecificUserWelcome::class],
            'specificOperation'=>[self::class,'specificOperation']],
    ];


    // activatePasswordRoute
    // retourne la route a utilisé pour l'activation d'un mot de passe
    public function activatePasswordRoute():string
    {
        return Lemur\Route\ActivatePassword::class;
    }


    // specificOperation
    // utilisé dans le cms, permet d'envoyer un courriel de bienvenue à l'utilisateur
    public static function specificOperation(self $row):string
    {
        $r = '';
        $route = $row->routeClass('userWelcome');

        if($row->table()->hasPermission('userWelcome'))
        {
            if($row->isActive() && $row->allowWelcomeEmail() && $row->isUpdateable() && $row->canReceiveEmail())
            {
                $route = $row->routeClass('userWelcome');

                if(!empty($route))
                {
                    $route = $route::makeOverload($row);
                    $data = ['confirm'=>static::langText('common/confirm')];
                    $attr = ['name'=>'--userWelcome--','value'=>1,'submit','icon','padLeft','email','data'=>$data];
                    $r .= $route->submitTitle(null,$attr);
                }
            }
        }

        return $r;
    }
}

// init
User::__init();
?>