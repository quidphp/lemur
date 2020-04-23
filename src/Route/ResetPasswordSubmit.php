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

// resetPasswordSubmit
// abstract class for a reset password submit route
abstract class ResetPasswordSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'en'=>'password/reset/submit',
            'fr'=>'mot-de-passe/reinitialisation/soumettre'],
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
        'group'=>'submit',
        'log'=>null
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->allowResetPasswordEmail();
    }


    // onSuccess
    // traite le succès
    final protected function onSuccess():void
    {
        static::timeoutIncrement('success');

        return;
    }


    // onFailure
    // traite l'erreur
    final protected function onFailure():void
    {
        static::timeoutIncrement('failure');

        return;
    }


    // routeSuccess
    // route à utiliser pour la redirection en cas de succès
    public function routeSuccess():Lemur\Route
    {
        return Login::make();
    }


    // routeFailure
    // retourne l'objet route pour la redirection en cas d'erreur
    final protected function routeFailure():Lemur\Route
    {
        return static::makeParent();
    }


    // proceed
    // lance le processus resetPasswordSubmit
    final public function proceed():?string
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
    final public function post():array
    {
        $return = [];
        $request = $this->request();
        $return['email'] = (string) $request->get('email');

        return $return;
    }


    // emailReplace
    // replace pour l'envoie de courriel
    final protected function emailReplace():?array
    {
        return null;
    }


    // getOption
    // option pour le reset password
    final protected function getOption():?array
    {
        return ['com'=>true];
    }
}

// init
ResetPasswordSubmit::__init();
?>