<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;

// accountSubmit
// abstract class for an account submit route
abstract class AccountSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'en'=>'my-account/submit',
            'fr'=>'mon-compte/soumettre'],
        'match'=>[
            'method'=>'post',
            'role'=>['>='=>'user'],
            'post'=>['email'],
            'timeout'=>true,
            'genuine'=>true,
            'csrf'=>true],
        'timeout'=>[
            'failure'=>['max'=>25,'timeout'=>600],
            'success'=>['max'=>25,'timeout'=>600]],
        'parent'=>Account::class,
        'baseFields'=>['email'],
        'group'=>'submit'
    ];


    // onSuccess
    // callback appelé lors d'une modification réussi
    final protected function onSuccess():void
    {
        static::sessionCom()->stripFloor();
        static::timeoutIncrement('success');

        return;
    }


    // onFailure
    // callback appelé lors d'une modification échouée
    final protected function onFailure():void
    {
        static::timeoutIncrement('failure');

        return;
    }


    // row
    // retourne la row user
    final public function row():Core\Row
    {
        return static::session()->user();
    }


    // routeSuccess
    // retourne l'objet route à rediriger en cas de succès ou erreur
    final public function routeSuccess():Lemur\Route
    {
        return static::makeParent();
    }


    // post
    // retourne le tableau post pour la modification du compte
    final public function post():array
    {
        $return = [];
        $request = $this->request();
        $post = $request->post(true,true);
        $keep = $this->getBaseFields();
        $return['data'] = Base\Arr::gets($keep,$post);

        return $return;
    }


    // proceed
    // lance le processus pour modifier le compte
    // retourne null ou un int
    final protected function proceed():?int
    {
        $return = null;
        $row = $this->row();
        $option = $this->getOption();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $row->setUpdateValid($post['data'],$option);

        if(is_int($return))
        $this->successComplete();

        else
        $this->failureComplete();

        return $return;
    }


    // getOption
    // option pour le update
    final protected function getOption():?array
    {
        return ['com'=>true];
    }


    // getBaseFields
    // retourne les champs de base
    final public function getBaseFields():array
    {
        return $this->getAttr('baseFields') ?? [];
    }
}

// init
AccountSubmit::__init();
?>