<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// specificUserWelcome
// class for the specific user welcome route which can send a welcome email to the user
class SpecificUserWelcome extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_specificPrimary;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_primary;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'table/user/[primary]/courriel-bienvenue',
            'en'=>'table/user/[primary]/welcome-emeail'],
        'segment'=>[
            'primary'=>'structureSegmentPrimary'],
        'row'=>Core\Row\User::class,
        'parent'=>Specific::class,
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'post'=>['id'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'genuine'=>true,
            'role'=>['>'=>'user']],
        'group'=>'specific'
    ];


    // onBefore
    // vérifie que le user peut bien recevoir un courriel de bienvenue
    protected function onBefore()
    {
        $return = false;
        $row = $this->row();
        $table = $row->table();

        if($table->hasPermission('view','userWelcome'))
        {
            if($row->isActive() && $row->allowWelcomeEmail() && $row->isUpdateable() && $row->canReceiveEmail())
            $return = true;
        }

        return $return;
    }


    // onSuccess
    // communication lors du succès
    protected function onSuccess()
    {
        static::sessionCom()->pos('user/welcome/success');

        return;
    }


    // onFailure
    // communication lors d'un échec
    protected function onFailure()
    {
        static::sessionCom()->neg('user/welcome/failure');

        return;
    }


    // routeSuccess
    // retourne la route à rediriger en cas de succès ou échec de l'opération
    public function routeSuccess():Core\Route
    {
        return $this->row()->route();
    }


    // proceed
    // procède à envoyer le courriel
    public function proceed():bool
    {
        $return = false;
        $row = $this->row();
        $replace = $this->emailReplace();
        $option = $this->emailOption();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $row->sendWelcomeEmail($replace,$option);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // emailReplace
    // replace pour l'envoie de courriel
    protected function emailReplace():?array
    {
        return null;
    }


    // emailOption
    // option pour l'envoie de courriel
    protected function emailOption():?array
    {
        return ['com'=>true];
    }
}

// init
SpecificUserWelcome::__init();
?>