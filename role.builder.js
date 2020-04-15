/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 
 * //creep is the variable passed from the main module where creep == Game.creeps['CreepName']
 */

var roleBuilder = {
    run: function(creep){
        var stored_energy = creep.store[RESOURCE_ENERGY];
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES); //I don't know what all of this does yet. //this can be optimized for specific targets, and not just closest object?
        
        //console.log(target); //trace statement for debugging
        
        /* create or set a field in memory that will be used to identify if the creep should be harvesting energy.
        *It should be lowered when the creep should be harvesting energy (aka energy store has been depleted), and raised when the capacity is full. Only lowered when the energy store has been fully depleted.
        *This is a persistent flag accross ticks.
        */
        if(stored_energy == 0){ //initialize the memory flag in case the creep spawn didn't have it. 
             creep.memory.energy_flag = 0; 
        }
        
        if(creep.memory.energy_flag == 0){
          var sources = creep.room.find(FIND_SOURCES); //find all energy sources in the room 
             if(creep.harvest(sources[0])==ERR_NOT_IN_RANGE){ //this attempts to harvest the first source in the room. if it returns -6, then it moves to the source.
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}}); // ****Let's clean up the flow here. optimize for better reading. 
                creep.say('🚩' + ' ' + creep.memory.energy_flag); 
             }
             else{//if it is in range and the harvest was successful
                    creep.say('B-Dig');
                 if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() ){ //if the amount of resource energy held in this creep is equal to its max capacity. This may need to be changed for different resources 
                     creep.say('full');
                     creep.moveTo(Game.flags.Flag2); //temp
                     creep.memory.energy_flag = 1; //raise the energy flag to stop harvesting energy on the next tick
                 } 
                 //creep.say('ha');
             }
        }//end if loop for energy flag lowered
        
        if(creep.memory.energy_flag ==1){
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#aaaaaa'}});
                    creep.say('building');
                }
                else{
                    creep.say('Build');
                }
            }
        }//end if loop for energy flag raised 

    } //end function loop

}; //end variable defintion?

module.exports = roleBuilder;