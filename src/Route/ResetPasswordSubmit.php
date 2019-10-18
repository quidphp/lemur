<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// resetPasswordSubmit
// abstract class for a reset password submit route
abstract class ResetPasswordSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'mot-de-passe/reinitialisation/soumettre',
            'en'=>'password/reset/submit'],
        'match'=>[
            'method'=>'post',
            'session'=>'allowResetPasswordEmail',
            'role'=>'nobody',
            'post'=>['email'],
            'timeout'=>true,
            'csrf'=>true,
            'genuine'=>true],
        'timeout'=>[
            'failure'=>['max'=>8,'timeout'=>600],
            'success'=>['max'=>2,'timeout'=>600]],
        'parent'=>ResetPassword::class,
        'group'=>'submit'
    ];


    // onSuccess
    // traite le succès
    protected function onSuccess():void
    {
        static::timeoutIncrement('success');

        return;
    }


    // onFailure
    // traite l'erreur
    protected function onFailure():void
    {
        static::timeoutIncrement('failure');

        return;
    }


    // routeSuccess
    // route à utiliser pour la redirection en cas de succès
    public function routeSuccess():Lemur\Route
    {
        return Login::makeOverload();
    }


    // routeFailure
    // retourne l'objet route pour la redirection en cas d'erreur
    protected function routeFailure():Lemur\Route
    {
        return static::makeParentOverload();
    }


    // proceed
    // lance le processus resetPasswordSubmit
    public function proceed():?string
    {
        $return = null;
        $session = static::session();
        $class = $session->getUserClass();
        $request = $this->request();
        $replace = $this->emailReplace();
        $option = $this->getOption();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $class::resetPasswordProcess($post['email'],$replace,$option);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // post
    // retourne le tableau post pour le reset du mot de passe
    public function post():array
    {
        $return = [];
        $request = $this->request();
        $return['email'] = (string) $request->get('email');

        return $return;
    }


    // emailReplace
    // replace pour l'envoie de courriel
    protected function emailReplace():?array
    {
        return null;
    }


    // getOption
    // option pour le reset password
    protected function getOption():?array
    {
        return ['com'=>true];
    }
}

// init
ResetPasswordSubmit::__init();
?>