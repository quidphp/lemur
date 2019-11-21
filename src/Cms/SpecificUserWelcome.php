<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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
            'en'=>'table/user/[primary]/welcome-email',
            'fr'=>'table/user/[primary]/courriel-bienvenue'],
        'segment'=>[
            'primary'=>'structureSegmentPrimary'],
        'row'=>Core\Row\User::class,
        'parent'=>Specific::class,
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'post'=>['id'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'genuine'=>true,
            'session'=>'canLogin'],
        'group'=>'specific'
    ];


    // canTrigger
    // vérifie que le user peut bien recevoir un courriel de bienvenue
    final public function canTrigger():bool
    {
        $return = false;
        $row = $this->row();
        $table = $row->table();

        if(parent::canTrigger() && $table->hasPermission('view','userWelcome'))
        {
            if($row->isActive() && $row->allowWelcomeEmail() && $row->isUpdateable() && $row->canReceiveEmail())
            {
                if($row !== static::session()->user())
                $return = true;
            }
        }

        return $return;
    }


    // onSuccess
    // communication lors du succès
    final protected function onSuccess()
    {
        static::sessionCom()->pos('user/welcome/success');

        return;
    }


    // onFailure
    // communication lors d'un échec
    final protected function onFailure()
    {
        static::sessionCom()->neg('user/welcome/failure');

        return;
    }


    // routeSuccess
    // retourne la route à rediriger en cas de succès ou échec de l'opération
    final public function routeSuccess():Core\Route
    {
        return $this->row()->route();
    }


    // proceed
    // procède à envoyer le courriel
    final public function proceed():bool
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
    final protected function emailReplace():?array
    {
        return null;
    }


    // emailOption
    // option pour l'envoie de courriel
    final protected function emailOption():?array
    {
        return ['com'=>true];
    }
}

// init
SpecificUserWelcome::__init();
?>