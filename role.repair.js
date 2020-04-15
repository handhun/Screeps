/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repair');
 * mod.thing == 'a thing'; // true
 */

var roleRepair = {
    run: function(creep, resource_flag){
        
        var repair_flag = creep.memory.repair_flag; // Flag to have creep repair one item at a time
        var repair_target = creep.memory.repair_target;
        
        creep.say('T' + resource_flag); //debugging step. Success! 
        creep.say('R-Flag is ' + '')
        
        if(creep.store[RESOURCE_ENERGY] == 0){
            resource_flag = 0;
            creep.memory.energy_flag = 0;
        }
    
        if(resource_flag == 0){
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('Repair -❤️');
            }
            
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
                creep.say('Full-M');
                creep.memory.energy_flag = 1;
                resource_flag = 1;
            }
            
        }//end if statmement : resource flag == 0 
        
        else if(resource_flag == 1){ // Repair behavior 
            const targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});

            targets.sort((a,b) => a.hits - b.hits);
            console.log(targets[0]);
            console.log(repair_target);
            creep.say('repairing');
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }//end else if statement 
        
    }//end function definition
    
    
}// end variable definition for module

module.exports = roleRepair