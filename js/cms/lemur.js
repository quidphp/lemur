/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// ready
$(document).ready(function() {
	
    // initial mount
    // comportements bindés une seule fois au tout début
    ael(this,'doc:mountInitial',function(event,body) {
        const background = body.find("> .background").first();
        const modal = body.find("> .modal").first();
        
        triggerSetup(Component.Background.call(background));
        triggerSetup(Component.Modal.call(modal));
    });
    
    
    // doc:mountCommon
    // événement appelé pour faire les bindings globaux
    // après le chargement d'une page ou d'un modal
    ael(this,'doc:mountCommon',function(event,node) {
        
        // input
        const input = node.find(Selector.input());
        Component.Input.call(input);

        // form
        const form = node.find("form");
        triggerCustom(Component.Form.call(form),'form:setup');

        // autre
        const anchorCorner = node.find("[data-anchor-corner='1']");
        const absolutePlaceholder = node.find("[data-absolute-placeholder='1']");
        
        // anchorCorner
        Component.AnchorCorner.call(anchorCorner);
        
        // absolutePlaceholder
        Component.AbsolutePlaceholder.call(absolutePlaceholder);
        
        /*
        // select
        const select = node.find("select");
        triggerSetup(Component.fakeSelect.call(select));
        
        // autre
        const popupTrigger = node.find(".popup-trigger.with-popup:not(.with-ajax)");
        const popupTriggerAjax = node.find(".popup-trigger.with-popup.with-ajax");
        const anchorCorner = node.find("[data-anchor-corner='1']");
        
        const aConfirm = node.find("a[data-confirm]");
        
		// aConfirm
		Component.confirm.call(aConfirm,'click');
		
        // popupTrigger
        Component.clickOpenWithTrigger.call(popupTrigger,".popup-title");
        
        // popupTriggerAjax
        Component.clickOpenAnchorAjax.call(popupTriggerAjax,".popup-title");
        */
	});
    
    
	// document mount
    // comportements utilisés pour toutes les pages du CMS
	ael(this,'doc:mount',function(event,routeWrap) {
		const burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
		const com = routeWrap.find("main > .inner > .com");
        const subMenu = routeWrap.find(".with-submenu");
        const carousel = routeWrap.find(".with-carousel");
        const mainSearch = routeWrap.find("header .top form");
        
        // burger
        triggerSetup(Component.Burger.call(burger));
        
        /*
        // carousel
        Component.carousel.call(carousel);
        
        // subMenu
        Component.clickOpenWithTrigger.call(subMenu,".trigger");
        setFunc(subMenu,'clickOpen:getBackgroundFrom',function(event) {
            return 'submenu';
        });
        
        // com
		triggerSetup(Component.com.call(com));

        // mainSearch
        triggerSetup(Component.mainSearch.call(mainSearch));
        */
	});
    
    
    // document unmount
    ael(this,'doc:unmount',function(event,routeWrap) {
        const burger = routeWrap.find("header .burger-menu, .nav-fixed .nav-close");
        
        // burger
        triggerCustom(burger,'component:teardown');
    });
    
    
    // document ajax progress
    ael(this,'doc:ajaxProgress',function(event,percent,progressEvent) {
        const body = $(this).find("body");
        const progress = body.find(".loading-progress");
        const html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
        progress.html(html);
    });
    
    
    // login
    // comportement pour la page login
	ael(this,'route:login',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// resetPassword
    // comportement pour la page regénérer mon mot de passe
	ael(this,'route:resetPassword',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
	// register
    // comportement pour la page enregistrement
	ael(this,'route:register',function(event,routeWrap) {
		nobodyCommon.call(routeWrap);
	});
	
    
    // changePassword
    // comportement pour le popup changer mon mot de passe
	ael(this,'modal:accountChangePassword',function(event,modal) {
		const form = modal.find("form");
        triggerCustom(form,'form:focusFirst');
	});
    
    
    // home
    // comportement pour la page d'accueil du CMS une fois connecté
	ael(this,'route:home',function(event,routeWrap) {
        
        /*
		const feed = routeWrap.find("main .home-feed");
        const feedTogglers = feed.find(".block-head .feed-togglers > a");
        const feedBody = feed.find(".block-body");
        
        Component.appendContainer.call(feedBody);
        triggerCustom(feedBody,'feed:bind');
        
        
        Component.ajaxBlock.call(feedTogglers);
        
        setFunc(feedTogglers,'ajaxBlock:getStatusNode',function(event) {
            return feedBody;
        });
        
        ael(feedTogglers,'ajax:before',function(event) {
            feedTogglers.removeClass('selected');
            $(this).addClass('selected');
        })
        
        ael(feedTogglers,'ajax:success',function(event,data,textStatus,jqXHR) {
            triggerCustom(feedBody,'feed:overwrite',data);
        })
        
        ael(feedTogglers,'ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
            feedBody.html(parsedError);
        });
        */
	});
    
    
    // general
    // comportement pour la page de navigation
	ael(this,'route:general',function(event,routeWrap) {
		
        const main = routeWrap.find("main");
        const scroller = main.find(".scroller");
		const search = main.find(".left > .search");
		const pageLimit = main.find("input[name='limit'],input[name='page']");
        const table = scroller.find("table").first();
        const filter = table.find("th.filterable .filter-outer");
		const colsSorter = table.find("th.action");
		const filesSlider = table.find("td[data-group='media'] .slider");
        const quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        const highlight = table.find("tr.highlight");
        
        // dragScroll
        triggerSetup(Component.scrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));
        
        // page + limit
        Component.inputNumeric.call(pageLimit.get());
        
        // rowsChecker
        triggerSetup(Component.rowsChecker.call(main));
        
		// colsSorter
        Component.colsSorter.call(colsSorter);
		triggerCustom(colsSorter,'component:setup');
        
        // filter
		triggerSetup(Component.filter.call(filter));
        
		// search
		if(search.length)
		{
			const searchInput = search.find(".form input[type='text']");
			const searchSlide = search.find(".in");
			triggerSetup(Component.inputSearch.call(searchInput));
            Component.focusSlide.call(searchInput,searchSlide);
		}
        
        // filesSlider
        Component.slider.call(filesSlider,null,null,'.slider-element',false);
        
        // quickEdit
        triggerSetup(Component.quickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover',function(event) {
            $(this).removeClass('highlight');
        });
	});
    
    
    // unmount
    ael(this,'route:general:unmount',function(event,routeWrap) {
        const table = routeWrap.find("main .scroller table").first();
        const quickEdit = table.find("td[data-quick-edit='1'] a.quick-edit");
        
        // quickEdit
        triggerCustom(quickEdit,'quickEdit:revert');
    });
    
    
    // specificForm mount
    // permet de faire tous les bindings des champs (simples et complexes)
    ael(this,'specificForm:mount',function(event,node) {
        triggerCustom(this,'specificForm:bindMount',node);
        triggerCustom(this,'specificForm:bindView',node);
    });
    
    
    // bindView
    // permet de faire les bindings de champs
    // ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
    ael(this,'specificForm:bindView',function(event,node) {
        const date = node.find("[data-group='date'] .specific-component");
        const enumSet = node.find("[data-tag='search'] .specific-component");
        const checkboxSortable = node.find("[data-group='relation'][data-sortable='1'] .specific-component");
        const files = node.find("[data-group='media'] .specific-component");
        const addRemove = node.find("[data-tag='add-remove'] .specific-component");
        const textarea = node.find("[data-tag='textarea'] .specific-component");
        const anchorCorner = node.find("[data-anchor-corner]");
        
        // date
        triggerSetup(Component.calendarInput.call(date));
        
        // enumSet
        Component.enumSet.call(enumSet);
        
        // checkboxSortable
        Component.verticalSorter.call(checkboxSortable,".choice",'.choice-in');
        
        // files
        triggerSetup(Component.inputFiles.call(files));
        
        // addRemove
        triggerSetup(Component.addRemove.call(addRemove));
        
        // textarea
        triggerSetup(Component.textareaExtra.call(textarea));
        
        // anchorCorner
        triggerCustom(anchorCorner,'anchorCorner:refresh');
    });
    
    
    // specificForm unmount
    // permet démonter les champs du formulaire
    ael(this,'specificForm:unmount',function(event,node) {
        const textarea = node.find("[data-tag='textarea'] .specific-component");
        triggerCustom(textarea,'component:teardown');
    });
    
    
	// specific
    // comportement communs pour les pages spécifiques
	ael(this,'group:specific',function(event,routeWrap) {
        const form = routeWrap.find("main .inner > form.specific-form");
        const panel = form.find("> .form-inner > .panel");
        const submitConfirm = form.find("button[type='submit'][data-confirm]");
        
		// submitConfirm
        Component.confirm.call(submitConfirm,'click');
		
        // champs simples
        triggerCustom(this,'specificForm:bindMount',form);
        
        // avec panel
        if(panel.length > 1)
        Component.specificPanel.call(form);
        
        else
        triggerCustom(this,'specificForm:bindView',form);
	});
	
    
    // unmount
    // comportements communs pour démonter la page spécifique
    ael(this,'group:specific:unmount',function(event,routeWrap) {
        const form = routeWrap.find("main .inner > form.specific-form");
        triggerCustom(this,'specificForm:unmount',form);
    });
    
    
    // specificMulti
    // comportement pour la page de modification multiple
	ael(this,'route:specificMulti',function(event) {
        const form = $(this).find("main .inner > form.specific-form");
        const formElement = form.find(".form-element");
        
        setFunc(formElement,'specificMulti:isActive',function(event) {
            return triggerFunc(this,'specificMulti:getCheckbox').is(':checked');
        });
        
        setFunc(formElement,'specificMulti:getCheckbox',function(event) {
            return $(this).find(".disabler input[type='checkbox']");
        });
        
        setFunc(formElement,'specificMulti:getInputs',function(event) {
            return $(this).find("> .right").find(Selector.input());
        });
        
        ael(formElement,'specificMulti:refresh',function(event) {
            const isActive = triggerFunc(this,'specificMulti:isActive');
            const inputs = triggerFunc(this,'specificMulti:getInputs');
            $(this).attr('data-disabled',(isActive === true)? 0:1);
            triggerCustom(inputs,(isActive === true)? 'input:enable':'input:disable');
        });
        
        aelOnce(formElement,'specificMulti:setup',function(event) {
            const $this = $(this);
            const checkbox = triggerFunc(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change',function(event) {
                triggerCustom($this,'specificMulti:refresh');
            });
            
            triggerCustom(this,'specificMulti:refresh');
        });
        
        triggerCustom(formElement,'specificMulti:setup');
        
        triggerCustom(form,'form:prepare');
	});
    
    
    // nobodyCommon
    const nobodyCommon = function() {
        const browscap = $(this).find("main .browscap");
		const form = $(this).find("main form");
        
		triggerFunc(form,'form:focusFirst');
		
		if(!Browser.allowsCookie())
		browscap.find(".cookie-disabled").show();
        
        if(Browser.isUnsupported())
		browscap.find(".unsupported-browser").show();
    };
});