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
            'shared'=>['update'=>true],
            'user'=>['update'=>true],
            'contributor'=>['cmsLogin'=>true],
            'editor'=>['update'=>true,'cmsLogin'=>true],
            'subAdmin'=>['cmsLogin'=>true],
            'admin'=>['cmsLogin'=>true]],
        '@cms'=>[
            'permission'=>[
                '*'=>['userWelcome'=>false],
                'contributor'=>['insert'=>false],
                'editor'=>['insert'=>false],
                'subAdmin'=>['userWelcome'=>true],
                'admin'=>['userWelcome'=>true,'fakeRoles'=>true]],
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
    final public static function specificOperation(self $row):string
    {
        $r = '';
        $route = $row->routeSafe('userWelcome');

        if(!empty($route) && $route->canTrigger())
        {
            $route = $route::make($row);
            $data = ['confirm'=>static::langText('common/confirm')];
            $attr = ['name'=>'--userWelcome--','value'=>1,'with-icon','email','data'=>$data];
            $r .= $route->submitTitle(null,$attr);
        }

        return $r;
    }


    // userExport
    // méthode utilisé pour exporter les colonnes et cellules d'un utilisateur en plusieurs
    final public static function userExport(array $value,string $type,Core\Cell $cell,array $option):array
    {
        $return = [];
        $col = $cell->col();
        $relation = $col->relation();
        $table = $relation->relationTable();
        $cols = $table->cols()->filter(['isAttrNotEmpty'=>true],'relationExport');
        $cols = $cols->sortBy('getAttr',true,'relationExport');

        if($type === 'col')
        $return = $cols->label();

        else
        {
            $row = $cell->relationRow();
            $cells = $row->cells($cols);
            $return = $cells->pair('exportOne',$option);
        }

        return $return;
    }
}

// init
User::__init();
?>