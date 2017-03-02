# Ternary Filter

| Name             | Status  | Stable | Work but need more test | Nightly | Updated by        |
|------------------|---------|--------|-------------------------|---------|-------------------|
| Ternary Filter   | Version | x      | 1.1                     | 1.x     | Mathias PFAUWADEL |

## Patch Notes

1.1 : Adding Option for contextual ObjectPage Filter
1.0 : 1st version working

## Description:
Allow you to filter an display only ternary.

## Warning

Ternary should be use, with the creation layout (link : TBD)
and evolveOnDemand (link : TBD)

## Installation
https://github.com/casewise/cpm/wiki
link to EVOD installation (TBD)

## Structure of ternary

Ternary is a symetric association between 3 objects, evolve doesn't have it natively, we made a workaround.

Exemple : We want to make a ternary between A1, O1 and P1. We need to have association between all the elements and on each association we need to fill the uuid of the opposit object (we use uuid instead of id to avoid federation problem)
So we endup with : 

A1O1 with properties containaing (P1 UUID)
A1P1 with properties containaing (O1 UUID)
P1O1 with properties containaing (A1 UUID)

## Screenshot:
![](https://raw.githubusercontent.com/nevakee716/TernaryFilter/master/screen/1.png)

## Options

### Use Layout : Set the layout javascript class name you want to use to display this node

### Others Option : 
If Use Layout is a custom layout, you can pass custom option by here following this schema =>
Option1:ValueOption1:TypeOption1#Option2:ValueOption2:TypeOption2......

### Hide Empty lvl 0 : 
Hide the level 0 objects of the ternary if they don't have ternary

### Hide Empty lvl 1 : 
Hide the level 1 objects of the ternary if they don't have ternary

### ObjectPageContextualFilter : 
This will filter the last level of the Ternary to allow only the one of the ObjectPage


## Configuration

Display your nodes for exemple Organisation -> Activity -> Process. Don't forget to add UUID on Process and OPPOSITUUIDLIST on the association (the scriptname is static for now, but will be an option later in the devvelopment)

<img src="https://raw.githubusercontent.com/nevakee716/TernaryFilter/master/screen/2.png" alt="Drawing" style="width: 95%;"/>
<img src="https://raw.githubusercontent.com/nevakee716/TernaryFilter/master/screen/3.png" alt="Drawing" style="width: 95%;"/>
<img src="https://raw.githubusercontent.com/nevakee716/TernaryFilter/master/screen/4.png" alt="Drawing" style="width: 95%;"/>





