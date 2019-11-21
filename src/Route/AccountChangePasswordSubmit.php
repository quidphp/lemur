<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// accountChangePasswordSubmit
// abstract class for an account change password submit route
abstract class AccountChangePasswordSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'en'=>'my-account/change-password/submit',
            'fr'=>'mon-compte/mot-de-passe/soumettre'],
        'match'=>[
            'method'=>'post',
            'session'=>'canLogin',
            'post'=>['oldPassword','newPassword','newPasswordConfirm'],
            'genuine'=>true,
            'csrf'=>true],
        'parent'=>AccountChangePassword::class,
        'group'=>'submit',
        'log'=>null
    ];


    // onFailure
    // callback appelé lors d'un changement avec erreur
    final protected function onFailure():void
    {
        $com = static::session()->com();
        $com->keepCeiling();

        return;
    }


    // routeSuccess
    // retourne l'objet route pour la redirection
    public function routeSuccess():Lemur\Route
    {
        return static::makeParent();
    }


    // proceed
    // procède au changement de mot de passe
    final public function proceed():bool
    {
        $return = false;
        $session = static::session();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $session->changePassword($post['newPassword'],$post['newPasswordConfirm'],$post['oldPassword'],['com'=>true]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // post
    // retourne les données post pour le changement de mot de passe compte
    final protected function post():array
    {
        $return = [];
        $request = $this->request();

        foreach ($this->getFields() as $value)
        {
            if(is_string($value))
            $return[$value] = (string) $request->get($value);
        }

        return $return;
    }


    // getFields
    // retourne le nom des champs pour le formulaire
    final public function getFields():array
    {
        return $this->getAttr(['match','post']) ?? [];
    }
}

// init
AccountChangePasswordSubmit::__init();
?>