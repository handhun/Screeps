/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 
 * this module should be cleaned up to look more like role.builder 
 */

// *Module to have a creep upgrade the room controller 
var roleUpgrader = {
    run: function(creep){
        var stored_energy = creep.store[RESOURCE_ENERGY];

        if(stored_energy == 0){ //if empty, lower the flag, and allow for harvesting
            creep.memory.energy_flag = 0; //set a persistent flag accross ticks. 

        }
        if(creep.memory.energy_flag==0){
            var sources = creep.room.find(FIND_SOURCES);
            //console.log(stored_energy); //trace comment
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
                creep.memory.energy_flag = 1; // raise the flag, this will allow the creep to go to a controller for an upgrade. modify the if statement to pull from max capacity property.
                console.log('upgrader storage is full')
            }
            if(Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) < 50){ //can be automated,maybe turn into a switch statement?
                if(creep.withdraw(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns.Spawn1,{visualizePathStyle: {stroke: '#ffffff'}});
                }
                else{
                    console.log('Spawn energy transfer to upgrader');
                }
            }
            else if(creep.harvest(sources[0])==ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}}); // ****Let's clean up the flow here. optimize for better reading. 
                creep.say('🚩' + ' ' + creep.memory.energy_flag);     
            }
            else{
                creep.say('U-Dig');
            }
        }
        else{ //if energy flag is up, go to the controller
            //creep.say('🧰🛠️! ');
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller,{visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('🚩'+ ' ' + creep.memory.energy_flag);
            }
        }
        
        roleUpgrader.buildRoad(creep);

        //statement block that has creep lay road construction sites if fatigue increases. May need further investigation into what the optimal creep fatigue # is. 
    }, //end 'run' function definition
    
    buildRoad: function(creep) {
        //console.log('build road function test'); //debug statement
        if(creep.fatigue > 3){
            //console.log('fatigue is '+ creep.fatigue); //trace statement
            let road_check = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}}); //find the closest road
            let road_distance = creep.pos.getRangeTo(road_check); //find the distance to the road
            if(road_distance > 0){
                let def = creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD); //create a site here --> creep is a 
                Game.notify('New function issued: New road construction command issued at ' + creep.pos, 1);
            }  
        }//end creep fatigue road generation statement
    }, //end buildRoad() function definition
    
    record: function(creep){
        console.log('record - debug statement upgrader');
        //work pending
    },
}; //end object definition roleUpgrader 

module.exports = roleUpgrader;