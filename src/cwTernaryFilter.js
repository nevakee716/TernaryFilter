/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery*/

(function(cwApi, $) {
    'use strict';

    var cwTernaryFilter = function(options, viewSchema) {
        var error;

        cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);      
        if(options.CustomOptions.hasOwnProperty('replace-layout')) {
            this.CreateOtherOptions(options.CustomOptions['other-options']);
            this.replaceLayout = options.CustomOptions['replace-layout'];
            this.lvl0Policy = options.CustomOptions['Hide-Empty-lvl-0'];
            this.lvl1Policy = options.CustomOptions['Hide-Empty-lvl-1'];       


            cwApi.extend(this, cwApi.cwLayouts[this.replaceLayout], options, viewSchema);
        
            

            cwApi.registerLayoutForJSActions(this);
            this.viewSchema = viewSchema; 

            
        } else {
            error = 'Cannot find replace-layout';
            cwAPI.Log.Error(error);   
            return error;         
        }



    };


    cwTernaryFilter.prototype.CreateOtherOptions = function(options) {
        if(options) {
            var optionList = options.split("#");
            var optionSplit;

            for (var i = 0; i < optionList.length; i += 1) {
                if(optionList[i] !== "") {
                    var optionSplit = optionList[i].split(";");
                    if(optionSplit[0] && optionSplit[1] && optionSplit[2] && optionSplit[2] === '1') {
                        if(optionSplit[1] === "true") {
                            this.options.CustomOptions[optionSplit[0]] = true;  
                        } else if(optionSplit[1] === "false") {
                            this.options.CustomOptions[optionSplit[0]] = false; 
                        }
                    }
                    else if(optionSplit[0] && optionSplit[1]  && optionSplit[2] === '0') {
                        this.options.CustomOptions[optionSplit[0]] = optionSplit[1];
                    }
                }
            }
        }
    };



    // obligatoire appeler par le system
    cwTernaryFilter.prototype.drawAssociations = function (output, associationTitleText, object) {
        if(this.options.CustomOptions['ObjectPageContextualFilter'] === true){
            this.getObjectPageID();
        }
        
        this.FilterObject(object);
        if(cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations) {
            cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations.call(this,output, associationTitleText, object);
        } else {
            cwApi.cwLayouts.CwLayout.prototype.drawAssociations.call(this,output, associationTitleText, object);
        }
    };
    
    // obligatoire appeler par le system
    cwTernaryFilter.prototype.drawOneMethod = function (output, object) {
        if(cwApi.cwLayouts[this.replaceLayout].prototype.drawOneMethod) {
            cwApi.cwLayouts[this.replaceLayout].prototype.drawOneMethod.call(this,output, object);
        } else  if(cwApi.cwLayouts[this.replaceLayout].drawOne) { //layoutList
            cwApi.cwLayouts[this.replaceLayout].drawOne.call(this,output, object);
        }
    };

    // obligatoire appeler par le system
    cwTernaryFilter.prototype.getObjectPageID = function () {
        var url = cwAPI.getURLHash();
        var myRegexp = /cwid=([0-9])*/;
        var match = myRegexp.exec(url);
        if(match) {
            this.ObjectPageID = match[0].replace("cwid=","");
        }
    };


    cwTernaryFilter.prototype.FilterObject = function(object) {
        var nodeToDelete,i,child;
        
        child = object.associations[this.mmNode.NodeID];
        nodeToDelete = [];
        for (i = 0; i < child.length; i += 1) {
            if(!this.FilterTernaryLvl0(child[i]) && this.lvl0Policy){
                nodeToDelete.push(i);
            }
 
        }
        for (var i = nodeToDelete.length-1; i >= 0; i -= 1) {
            delete child.splice(nodeToDelete[i], 1);
        }
        return true;
    };

    cwTernaryFilter.prototype.FilterTernaryLvl0 = function(child) {
        var nodeToDelete,i,child,associationNode,nextChild,isEmpty;

        nodeToDelete = [];
        isEmpty = !this.lvl1Policy;
        for (associationNode in child.associations) {
            if (child.associations.hasOwnProperty(associationNode)) {
                for (i = 0; i < child.associations[associationNode].length; i += 1) {
                    nextChild = child.associations[associationNode][i];
                    if(!this.FilterTernaryLvl1(nextChild)) {
                        nodeToDelete.push(i);
                    }
                }
                for (var i = nodeToDelete.length-1; i >= 0; i -= 1) {
                    delete child.associations[associationNode].splice(nodeToDelete[i], 1);
                }
                if(child.associations[associationNode].length !== 0) {
                    isEmpty = true;
                }
            }
        }
        return isEmpty;
    };

    cwTernaryFilter.prototype.FilterTernaryLvl1 = function(child) {
        var nodeToDelete,i,child,associationNode,nextChild,oppositUuidList,isEmpty;
        nodeToDelete = [];
        oppositUuidList = child.iProperties['opposituuidlist'];
        if(oppositUuidList !== "" && oppositUuidList !== undefined) {
            oppositUuidList = oppositUuidList.split("\n");
        } else {
            return false;
        }
        
        isEmpty = false;

        for (associationNode in child.associations) {
            if (child.associations.hasOwnProperty(associationNode)) {
                for (i = 0; i < child.associations[associationNode].length; i += 1) {
                    nextChild = child.associations[associationNode][i];
                    if(oppositUuidList.indexOf(nextChild.properties.uniqueidentifier) === -1 || (this.ObjectPageID && nextChild.object_id != this.ObjectPageID)) {
                        nodeToDelete.push(i);
                    } 
                }
                for (var i = nodeToDelete.length-1; i >= 0; i -= 1) {
                    delete child.associations[associationNode].splice(nodeToDelete[i], 1);
                }
                if(child.associations[associationNode].length !== 0) {
                    isEmpty = true;
                }
            }
        }
        return isEmpty;
    };

    cwApi.cwLayouts.cwTernaryFilter = cwTernaryFilter;

    }(cwAPI, jQuery));