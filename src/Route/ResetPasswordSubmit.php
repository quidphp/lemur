<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    protected static array $config = [
        'path'=>[
            'en'=>'password/reset/submit',
            'fr'=>'mot-de-passe/reinitialisation/soumettre'],
        'match'=>[
            'method'=>'post',
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
        $session = static::session();
        return parent::canTrigger() && $session->roles(false)->isNobody() && $session->user()->allowResetPasswordEmail();
    }


    // onSuccess
    // traite le succès
    final protected function onSuccess():void
    {
        static::timeoutIncrement('success');
    }


    // onFailure
    // traite l'erreur
    final protected function onFailure():void
    {
        static::timeoutIncrement('failure');
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
        $return = $class::resetPasswordProcess($post['email'],true,$replace,$option);

        return $this->proceedAfter($return);
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
    protected function getOption():?array
    {
        return ['com'=>true];
    }
}

// init
ResetPasswordSubmit::__init();
?>