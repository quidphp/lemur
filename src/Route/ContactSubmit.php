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

// contactSubmit
// abstract class for a contact submit route
abstract class ContactSubmit extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_formSubmit;


    // config
    public static $config = [
        'path'=>[
            'en'=>'contact-us/submit',
            'fr'=>'nous-joindre/soumettre'],
        'match'=>[
            'method'=>'post',
            'post'=>['name','phone','email','message'],
            'csrf'=>true,
            'captcha'=>true,
            'genuine'=>true,
            'timeout'=>true],
        'timeout'=>[
            'failure'=>['max'=>8,'timeout'=>600],
            'success'=>['max'=>2,'timeout'=>600]],
        'parent'=>Contact::class,
        'group'=>'submit',
        'row'=>Lemur\Row\Contact::class,
        'flashPost'=>true
    ];


    // onSuccess
    // traite le succès
    final protected function onSuccess():void
    {
        static::sessionCom()->stripFloor();
        static::timeoutIncrement('success');

        return;
    }


    // onFailure
    // increment le timeout et appele onFailure
    final protected function onFailure():void
    {
        static::sessionCom()->stripFloor();
        static::timeoutIncrement('failure');

        return;
    }


    // routeSuccess
    // retourne la route vers laquelle redirigé, home par défaut
    final public function routeSuccess():Core\Route
    {
        return Home::make();
    }


    // post
    // retourne les données post pour le formulaire de contact
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


    // proceed
    // lance le processus pour le contact
    final protected function proceed():?Core\Row
    {
        $return = null;
        $session = static::session();
        $table = static::tableFromRowClass();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $table->insert($post,['com'=>true]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // getFields
    // retourne les champs pour le formulaire
    final public function getFields():array
    {
        return $this->getAttr(['match','post']) ?? [];
    }
}

// init
ContactSubmit::__init();
?>