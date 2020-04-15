/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.maintenance');
 * mod.thing == 'a thing'; // true
 
 * This module is to define a creep role for maintaining spawn and extensions, maybe clean up tombstones, maintain roads 
 */

var roleMaintenance = {
    run: function(creep){
        var stored_energy = creep.store[RESOURCE_ENERGY]; //define how much energy the creep is holding. Maybe import this from the main function?
        var extension_sites = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        var transfer_targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||  
                        (structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                        (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
                    }
        });
       
        //console.log('Spawn has '+extension_sites.length+' extensions available'); //debugging 
        
        /* create or set a field in memory that will be used to identify if the creep should be harvesting energy.
        *It should be lowered when the creep should be harvesting energy (aka energy store has been depleted), and raised when the capacity is full. Only lowered when the energy store has been fully depleted.
        *This is a persistent flag accross ticks.
        */
        if(stored_energy == 0){ //initialize the memory flag in case the creep spawn didn't have it.  //maybe put this in the main function and see if it breaks 
             creep.memory.energy_flag = 0; 
             creep.memory.repairTarget = "false"; //initialize the repair target if stored energy == 0
        }
        
        if(creep.memory.energy_flag == 0){ //if it's out of energy, go collect some 
          var sources = creep.room.find(FIND_SOURCES); //find all energy sources in the room 
          
            if(creep.harvest(sources[0])==ERR_NOT_IN_RANGE){ //this attempts to harvest the first source in the room. if it returns -6, then it moves to the source.
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}}); // ****Let's clean up the flow here. optimize for better reading. 
                creep.say('M-0'); // ->'🚩 0'
            }
            else{//if it is in range and the harvest was successful
                    creep.say('M-dig');
                 if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){ //if the amount of resource energy held in this creep is equal to its max capacity. This may need to be changed for different resources 
                     creep.say('M-full');
                     creep.moveTo(Game.flags.Flag2); //temp
                     creep.memory.energy_flag = 1; //raise the energy flag to stop harvesting energy on the next tick
                 }
            }
        }
        else{//if flag is 1 aka creep has energy in store, repair roads or maintain extensions
            creep.say('M-⚒️'); //debug only 
            //console.log(transfer_targets[0] + 'maintenance debug');
            if(transfer_targets.length > 0) {//maintain extensions   
                if(creep.transfer(transfer_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(transfer_targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    //console.log(transfer_targets[0] + ' maintenance debug'); //debug statement
                }
            }
            else if (transfer_targets.length == 0){ // repair behavior
                creep.say('M-fix');
                let repair_targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                repair_targets.sort((a,b) => a.hits - b.hits);
                //console.log(repair_targets[0]); debugging statement
                
                if(repair_targets.length > 0){
                    if(creep.memory.repairTarget!= 'false'){
                        if(creep.repair(Game.getObjectById(creep.memory.repairTarget)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.repairTarget), {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                        console.log(creep.memory.repairTarget);
                        creep.say('persist');
                        
                     }
                     else{
                        creep.memory.repairTarget = repair_targets[0].id; //
                        if(creep.repair(repair_targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(repair_targets[0], {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                     }//end elseloop if repair target Id is undefined 
                } //end if loop if targets to repair do not exist
            }//end else if loop for repair behavior code block

        } //end else statement if flag is 1
        
        //Find all items that should be maintained (not done)
        
        //Extension or Tombstone or Road
        
        
    }//end function loop defined as 'run'
    
};// end variable definition  

module.exports = roleMaintenance;