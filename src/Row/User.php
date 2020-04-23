<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;

// user
// extended class for a row of the user table, with cms logic
class User extends Core\Row\User
{
    // config
    public static $config = [
        'permission'=>[
            '*'=>['cmsLogin'=>false],
            'contributor'=>['cmsLogin'=>true],
            'editor'=>['cmsLogin'=>true],
            'subAdmin'=>['cmsLogin'=>true],
            'admin'=>['cmsLogin'=>true]],
        'emailModel'=>[
            'userWelcome'=>null],
        '@cms'=>[
            'permission'=>[
                'contributor'=>['insert'=>false],
                'editor'=>['insert'=>false],
                'subAdmin'=>['fakeRoles'=>true],
                'admin'=>['fakeRoles'=>true]],
            'route'=>[
                'homeFeed'=>Lemur\Cms\HomeFeed::class,
                'userWelcome'=>Lemur\Cms\UserWelcome::class],
            'specificOperation'=>[self::class,'specificOperation']],
    ];


    // onWelcomeEmailSent
    // lorsque le courriel de bienvenue a été envoyé à l'utilisateur
    final protected function onWelcomeEmailSent():void
    {
        return;
    }


    // allowWelcomeEmail
    // retourne vrai si le user permet l'envoie de courrier de bienvenue
    final public function allowWelcomeEmail():bool
    {
        return $this->isSomebody() && $this->isActive() && $this->isUpdateable() && $this->canReceiveEmail() && !empty($this->welcomeEmailModel());
    }


    // welcomeEmail
    // retourne un tableau avec tout ce qu'il faut pour envoyer le courriel de bienvenue
    final public function welcomeEmail(?array $replace=null):?array
    {
        return $this->getEmailArray('welcome',$replace);
    }


    // welcomeEmailModel
    // retourne le model pour le courriel de bienvenue ou null
    final public function welcomeEmailModel():?Main\Contract\Email
    {
        return $this->getEmailModel('userWelcome');
    }


    // welcomeEmailReplace
    // retourne les valeurs de remplacement pour le courriel de bienvenue
    public function welcomeEmailReplace():array
    {
        return $this->getEmailReplace();
    }


    // sendWelcomeEmail
    // envoie le courriel de bienvenue
    // plusieurs exceptions peuvent être envoyés
    final public function sendWelcomeEmail(?array $replace=null,?array $option=null):bool
    {
        $return = false;
        $closure = function(array $return) {
            if(empty($return['password']) || !is_string($return['password']))
            {
                $newOption = $this->getAttr('crypt/passwordNew');
                $password = Base\Crypt::passwordNew($newOption);

                if($this->setPassword([$password]) !== 1)
                static::throw('cannotChangePassword');
                $return['password'] = $password;
            }

            return $return;
        };
        $return = $this->sendEmail('welcome',$this,$replace,$closure,$option);

        return $return;
    }


    // activatePasswordRoute
    // retourne la route a utilisé pour l'activation d'un mot de passe
    public function activatePasswordRoute():string
    {
        return Lemur\Route\ActivatePassword::class;
    }


    // homeFeedRelationOutput
    // génère le output pour le homeFeedRelation de la page d'accueil du CMS
    final public function homeFeedRelationOutput():string
    {
        $return = null;
        $route = $this->route('homeFeed');
        $label = $this->namePrimary();
        $return .= $route->a($label,'feed-anchor');

        return $return;
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